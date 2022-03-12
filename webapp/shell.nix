with import <nixpkgs> {};
mkShell {
  packages = [
    nodejs-16_x
    yarn
    nodePackages."@angular/cli"
  ];
}
