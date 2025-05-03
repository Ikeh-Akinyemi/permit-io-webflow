# Dockerfile for PDP
FROM permitio/pdp-v2:latest

EXPOSE 7000

ENV PDP_DEBUG=True
ENV PDP_API_KEY=${PERMIT_API_KEY}