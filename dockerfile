FROM debian:buster-slim


RUN apt-get update -qq \
    && DEBIAN_FRONTEND=noninteractive \
    apt-get install --assume-yes --no-install-recommends \
    locales ca-certificates openssh-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Just for testing puroses...
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
