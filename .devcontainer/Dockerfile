FROM mcr.microsoft.com/vscode/devcontainers/base:alpine

# apk setup
RUN apk update

# configure the user
ARG USERNAME=vscode
USER ${USERNAME}

# Install Go tools
RUN sudo apk add go~1.20
RUN go install -v golang.org/x/tools/gopls@latest
RUN go install -v github.com/go-delve/delve/cmd/dlv@latest

# Install docker
RUN sudo apk add docker-cli
# RUN sudo touch /var/run/docker.sock
# RUN sudo chown ${USERNAME} /var/run/docker.sock

# set up gitconfig. Mount hosts .gitconfig to "/home/${USERNAME}/.gitconfig.host"
WORKDIR /home/${USERNAME}/
COPY .gitconfig .gitconfig

# install nvim
WORKDIR /home/${USERNAME}/tools
RUN sudo apk add nodejs npm neovim figlet
RUN git clone https://github.com/AnthonyThomasson/nvim.git
WORKDIR /home/${USERNAME}/tools/nvim
RUN ./install.sh > install.log

# install zsh
WORKDIR /home/${USERNAME}/tools
RUN git clone https://github.com/AnthonyThomasson/zsh-config.git
WORKDIR /home/${USERNAME}/tools/zsh-config
RUN ./install.sh > install.log

# init command history (should be persisted with a volume)
# eg.
#   services:
#		...
#		volumes:
#			- devcontainer-zshhistory:/commandhistory
#		...
#	volumes: 
#		devcontainer-zshhistory:
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.zsh_history" \
	&& sudo mkdir -p /commandhistory \
	&& sudo touch /commandhistory/.zsh_history \
	&& sudo chown -R $USERNAME /commandhistory \
	&& sudo echo "$SNIPPET" >> "/home/$USERNAME/.zshrc"
