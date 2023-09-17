FROM mcr.microsoft.com/vscode/devcontainers/base:alpine

ARG USERNAME=vscode


WORKDIR /tools
RUN git clone https://github.com/AnthonyThomasson/zsh-config.git
WORKDIR /tools/zsh-config
RUN ./install.sh /home/$USERNAME > install.log

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.zsh_history" \
	&& mkdir /commandhistory \
	&& touch /commandhistory/.zsh_history \
	&& chown -R $USERNAME /commandhistory \
	&& echo "$SNIPPET" >> "/home/$USERNAME/.zshrc"