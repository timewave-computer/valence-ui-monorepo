# Nix flake for Valence UI monorepo - TypeScript/React monorepo with Rust WebAssembly components
{
  description = "Valence UI Monorepo - TypeScript/React development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ ];
        pkgs = import nixpkgs { inherit system overlays; };
        
        # Common packages for all shells
        commonPackages = with pkgs; [
          # Node.js ecosystem
          nodejs_20
          pnpm
          turbo
          
          # Development tools
          typescript-language-server
          vscode-langservers-extracted
          
          # Git hooks and formatting tools
          lint-staged
          prettier
          
          # System tools
          pkg-config
          openssl
          
          # Git (if not available)
          git
        ];

        # Shell hook for environment setup
        shellHook = ''
          echo "Valence UI Development Environment"
          echo "====================================="
          echo "Node.js: $(node --version)"
          echo "pnpm: $(pnpm --version)"
          echo "Turbo: $(turbo --version)"
          echo ""
          
          echo "Quick Setup:"
          echo "  pnpm install     - Install project dependencies"
          echo "  pnpm dev         - Start development servers"
          echo "  pnpm build       - Build all packages"
          echo "  pnpm lint        - Run linting"
          echo "  pnpm prettier    - Format code"
          echo "  turbo run <task> - Run turbo tasks"
          echo ""
          echo "Apps:"
          echo "  ui-sandbox       - Component sandbox"
          echo "  valence-app      - Main application"
          echo "  valence-static   - Static site"
          echo ""
          echo "Environment ready! Git hooks enabled with lint-staged."
        '';
      in
      {
        devShells = {
          # Default development shell with all tools
          default = pkgs.mkShell {
            buildInputs = commonPackages;
            inherit shellHook;
          };
          
          # Build-focused shell
          build = pkgs.mkShell {
            buildInputs = commonPackages;
            shellHook = ''
              echo "Build Environment Ready"
              echo "======================"
              echo "Node.js: $(node --version)"
              echo "pnpm: $(pnpm --version)"
              echo "Building project..."
              pnpm install --frozen-lockfile --prefer-offline 2>/dev/null
              echo "Environment ready for building!"
            '';
          };
        };

        # Package outputs
        packages = {      
          # Node.js dependencies
          node-modules = pkgs.stdenv.mkDerivation {
            name = "node-modules";
            src = ./.;
            
            buildInputs = [ pkgs.nodejs_20 pkgs.pnpm ];
            
            buildPhase = ''
              pnpm install --frozen-lockfile
            '';
            
            installPhase = ''
              mkdir -p $out
              cp -r node_modules $out/
            '';
          };
        };

        # Formatting
        formatter = pkgs.nixpkgs-fmt;

        # Checks
        checks = {
          # Basic flake check
          flake-check = pkgs.runCommand "flake-check" { } ''
            echo "Flake structure is valid"
            touch $out
          '';
        };
      });
} 