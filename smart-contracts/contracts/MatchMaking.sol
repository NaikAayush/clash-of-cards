// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

struct Player {
    address addr;
    uint stake;
    bool active;
}

struct Card {
    uint hp;
    uint atk;
    string url;
}

struct Round {
    Card p1_card1;
    Card p1_card2;
    bool p1_ready;
    Card p2_card1;
    Card p2_card2;
    bool p2_ready;
}

struct Match {
    Player p1;
    Player p2;
    Round[] rounds;
    uint8 p1_cards_left;
    uint8 p2_cards_left;
}

contract MatchMaking is KeeperCompatibleInterface {
    Player[] queue;
    mapping(uint256 => Match) matches; 
    function joinQueue(address addr, uint stake) public {
        Player memory player = Player(addr, stake, true);
        queue.push(player);
    }

    function getIndexOfPlayer(address addr) private view returns (uint id) {
        for(uint i = queue.length - 1; i >= 0; i--) {
            if (queue[i].addr == addr) {
                return i;
            }

            if (i == 0) {
                break;
            }
        }
    }

    function getMatch(address addr, uint stake) public returns (Player memory opponent) {
        uint opponentIndex;
        for(uint i = queue.length - 1; i >= 0; i--) {
            if (queue[i].active && queue[i].stake == stake && queue[i].addr != addr) {
                opponentIndex = i;
            }

            if (i == 0) {
                break;
            }
        }

        // TODO: error handling if opponentIndex go brr?
        queue[opponentIndex].active = false;
        queue[getIndexOfPlayer(addr)].active = false;
        return queue[opponentIndex];
    }

    event PublishMatchId(address indexed p1, address indexed p2, uint256 indexed matchId);

    function generateMatchID() private view returns (uint256 hash) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function pairOpponents() public {
        for(uint i = 0; i < queue.length; i++) {
            if (queue[i].active && queue.length > 1) {
                Player memory p1 = queue[i];
                Player memory p2 = getMatch(p1.addr, p1.stake);
                // create matchid, and add to matches map
                uint256 matchId = generateMatchID();
                // matches[matchId] = Match(p1, p2, new Round[](0));
                Match storage storedMatch = matches[matchId];
                storedMatch.p1 = p1;
                storedMatch.p2 = p2;
                storedMatch.p1_cards_left = 8;
                storedMatch.p2_cards_left = 8;
                matches[matchId] = storedMatch;
                emit PublishMatchId(p1.addr, p2.addr, matchId);
            }
        }
    }

    event OpponentCardSubmit(address indexed opponent, uint256 indexed matchId, Card card_1, Card card_2);

    function submitCard(uint256 matchId, address player, uint hp_card1, uint atk_card1, string memory url_card1, uint hp_card2, uint atk_card2, string memory url_card2) public {
        Match memory currMatch = matches[matchId];
        uint len = currMatch.rounds.length;
        Round memory currRound = currMatch.rounds[len - 1];
        Card memory card_1 = Card(hp_card1, atk_card1, url_card1);
        Card memory card_2 = Card(hp_card2, atk_card2, url_card2);
        if (currMatch.p1.addr == player) {
            currRound.p1_card1 = card_1;
            currRound.p1_card2 = card_2;
            currRound.p1_ready = true;
        } else {
            currRound.p2_card1 = card_1;
            currRound.p2_card2 = card_2;
            currRound.p2_ready = true;      
        }
        emit OpponentCardSubmit(player, matchId, card_1, card_2);

        if (currRound.p1_ready && currRound.p2_ready) {
            startRound(matchId, currRound);
        }
    }

    event EndOfRound(address indexed p1, address indexed p2, uint256 indexed matchId, Round round);

    function startRound(uint256 matchId, Round memory round) private {
        uint p1_atk = round.p1_card1.atk + round.p1_card2.atk;
        uint p1_hp = round.p1_card1.hp + round.p1_card2.hp;
        uint p2_atk = round.p2_card1.atk + round.p2_card2.atk;
        uint p2_hp = round.p2_card1.hp + round.p2_card2.hp;

        uint p1_hp_left;
        uint p2_hp_left;
        if (p2_atk > p1_hp) {
            p1_hp_left = 0;
            matches[matchId].p1_cards_left -= 2;
        } else {
            p1_hp_left = p1_hp - p2_atk;
        }

        if (p1_atk > p2_hp) {
            p2_hp_left = 0;
            matches[matchId].p2_cards_left -= 2;
        } else {
            p2_hp_left = p2_hp - p1_atk;
        }

        round.p1_card1.hp = p1_hp_left / 2;
        round.p1_card2.hp = p1_hp_left / 2;

        round.p2_card1.hp = p2_hp_left / 2;
        round.p2_card2.hp = p2_hp_left / 2;

        address p1 = matches[matchId].p1.addr;
        address p2 = matches[matchId].p2.addr;

        emit EndOfRound(p1, p2, matchId, round);
    }

    /**
    * Public counter variable
    **/
    uint public counter;

    /**
    * Use an interval in seconds and a timestamp to slow execution of Upkeep
    **/
    uint public immutable interval;
    uint public lastTimeStamp;

    constructor(uint updateInterval) {
      interval = updateInterval;
      lastTimeStamp = block.timestamp;

      counter = 0;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;
            counter = counter + 1;
            pairOpponents();
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

}
