FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4173
COPY --chown=node:node package.json server.mjs ./
COPY --chown=node:node dist ./dist
USER node
EXPOSE 4173
CMD ["node", "server.mjs"]
