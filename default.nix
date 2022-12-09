let
  sources = (import ./nix/sources.nix) {};
  pkgs = (import sources.nixpkgs) {};
  
  hlib = pkgs.haskell.lib;
  hpkgs = pkgs.haskell.packages.ghc92.override {
    overrides = final: old: {
      servant-elm = hlib.dontCheck (hlib.markUnbroken old.servant-elm);
    };
  };
in
hpkgs.developPackage {
  returnShellEnv = true;
  root = ./backend;
  modifier = drv:
    hlib.addBuildTools drv
      (with hpkgs;
        [ cabal-install
          ghcid
          haskell-language-server
          (with pkgs.elmPackages; [ elm ])
          pkgs.postgresql
        ]);
}
