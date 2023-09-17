FROM mcr.microsoft.com/vscode/devcontainers/base:alpine

RUN apk update && apk add docker-cli nodejs npm neovim figlet

ARG USERNAME=vscode

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.zsh_history" \
	&& mkdir /commandhistory \
	&& touch /commandhistory/.zsh_history \
	&& chown -R $USERNAME /commandhistory \
	&& echo "$SNIPPET" >> "/home/$USERNAME/.zshrc"

USER ${USERNAME}

WORKDIR /home/${USERNAME}/tools
RUN git clone https://github.com/AnthonyThomasson/zsh-config.git
WORKDIR /home/${USERNAME}/tools/zsh-config
RUN ./install.sh > install.log

WORKDIR /home/${USERNAME}/tools
RUN git clone https://github.com/AnthonyThomasson/nvim.git
WORKDIR /home/${USERNAME}/tools/nvim
RUN ./install.sh > install.log

WORKDIR /workspaces
RUN git config --global --add safe.directory /workspaces