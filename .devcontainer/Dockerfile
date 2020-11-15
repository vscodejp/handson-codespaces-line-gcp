# copy from https://github.com/microsoft/vscode-dev-containers/blob/master/containers/typescript-node/.devcontainer/Dockerfile
ARG VARIANT=12
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# Install Docker CE CLI
# https://github.com/microsoft/vscode-dev-containers/blob/v0.112.0/containers/docker-in-docker/.devcontainer/Dockerfile
RUN apt-get update \
    && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common lsb-release \
    && curl -fsSL https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/gpg | (OUT=$(apt-key add - 2>&1) || echo $OUT) \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*
    
# Install Google Cloud SDK
# https://github.com/GoogleCloudPlatform/cloud-sdk-docker/edit/master/Dockerfile
ARG CLOUD_SDK_VERSION=314.0.0
ENV CLOUD_SDK_VERSION=$CLOUD_SDK_VERSION
ENV PATH "$PATH:/opt/google-cloud-sdk/bin/"
RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb https://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" > /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    apt-get update && \
    apt-get install -y google-cloud-sdk=${CLOUD_SDK_VERSION}-0 && \
    gcloud --version
