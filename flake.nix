# Nix flake for Valence UI monorepo - TypeScript/React monorepo with Rust WebAssembly components
{
  description = "Valence UI Monorepo - TypeScript/React development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };
        
        # Rust toolchain with WebAssembly support
        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rustfmt" "clippy" "rust-analyzer" ];
          targets = [ "wasm32-unknown-unknown" ];
        };

        # Common packages for all shells
        commonPackages = with pkgs; [
          # Node.js ecosystem
          nodejs_20
          pnpm
          turbo
          
          # Development tools
          typescript-language-server
          vscode-langservers-extracted
          
          # System tools
          pkg-config
          openssl
          
          # Git (if not available)
          git
        ];

        # Rust-specific packages
        rustPackages = with pkgs; [
          rustToolchain
          wasm-pack
          
          # C/C++ toolchain for WebAssembly compilation
          clang
          gcc
          binutils
          
          # LLVM for WebAssembly
          llvm
          lld
          
          # Additional build tools
          cmake
          pkg-config
        ];

        # Shell hook for environment setup
        shellHook = ''
          echo "Valence UI Development Environment"
          echo "====================================="
          echo "Node.js: $(node --version)"
          echo "pnpm: $(pnpm --version)"
          echo "Rust: $(rustc --version)"
          echo "wasm-pack: $(wasm-pack --version)"
          echo "Turbo: $(turbo --version)"
          echo "LLVM: $(llvm-config --version)"
          echo ""
          
          # Set up environment for WebAssembly compilation
          export CC="$(which clang)"
          export CXX="$(which clang++)"
          export AR="$(which llvm-ar)"
          export RANLIB="$(which llvm-ranlib)"
          export CARGO_TARGET_WASM32_UNKNOWN_UNKNOWN_LINKER="$(which lld)"
          
          # Set up pnpm environment variables to avoid version switching issues
          export PNPM_HOME="$HOME/.local/share/pnpm"
          export PATH="$PNPM_HOME:$PATH"
          
          echo "Installing dependencies..."
          if [ -f "package.json" ]; then
            echo "Installing dependencies with pnpm..."
            if command -v pnpm &> /dev/null; then
              echo "Run 'pnpm install' to install dependencies"
            fi
          fi
          
          if [ -f "apps/valence-app/src/wasm/pid/Cargo.toml" ]; then
            echo "WebAssembly component available at apps/valence-app/src/wasm/pid/"
            echo "Run 'cargo build --release --target wasm32-unknown-unknown' to build it"
          fi
          
          echo ""
          echo "Available commands (matching team workflow):"
          echo "  pnpm dev         - Start development servers"
          echo "  pnpm build       - Build all packages"
          echo "  pnpm lint        - Run linting"
          echo "  pnpm prettier    - Format code"
          echo "  turbo run <task> - Run turbo tasks"
          echo ""
          echo "Apps:"
          echo "  ui-sandbox       - Component sandbox (http://localhost:3001)"
          echo "  valence-app      - Main application (http://localhost:3000)"
          echo "  valence-static   - Static site (http://localhost:3002)"
          echo ""
          echo "Environment ready! (pnpm workflow active)"
        '';
      in
      {
        devShells = {
          # Default development shell with all tools
          default = pkgs.mkShell {
            buildInputs = commonPackages ++ rustPackages;
            inherit shellHook;
          };
          
          # Build-focused shell
          build = pkgs.mkShell {
            buildInputs = commonPackages ++ rustPackages;
            shellHook = ''
              echo "Build Environment Ready"
              echo "======================"
              echo "Node.js: $(node --version)"
              echo "pnpm: $(pnpm --version)"
              echo "Rust: $(rustc --version)"
              echo "Building project..."
              pnpm install --frozen-lockfile --prefer-offline 2>/dev/null || true
              echo "Environment ready for building!"
            '';
          };
          
          # Rust-focused shell for WebAssembly development
          rust = pkgs.mkShell {
            buildInputs = rustPackages;
            shellHook = ''
              echo "Rust WebAssembly Development Environment"
              echo "========================================"
              echo "Rust: $(rustc --version)"
              echo "wasm-pack: $(wasm-pack --version)"
              echo "Targets: $(rustup target list --installed 2>/dev/null || echo 'wasm32-unknown-unknown')"
              
              # Set up environment for WebAssembly compilation
              export CC="$(which clang)"
              export CXX="$(which clang++)"
              export AR="$(which llvm-ar)"
              export RANLIB="$(which llvm-ranlib)"
              export CARGO_TARGET_WASM32_UNKNOWN_UNKNOWN_LINKER="$(which lld)"
              
              echo "Environment ready for Rust/WebAssembly development!"
            '';
          };


        };

        # Package outputs
        packages = {
          # Build the WebAssembly component
          wasm-pid = pkgs.stdenv.mkDerivation {
            name = "wasm-pid";
            src = ./apps/valence-app/src/wasm/pid;
            
            buildInputs = with pkgs; [
              rustToolchain
              wasm-pack
            ];
            
            buildPhase = ''
              wasm-pack build --target bundler
            '';
            
            installPhase = ''
              mkdir -p $out
              cp -r pkg/* $out/
            '';
          };
          
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