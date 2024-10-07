#########
# Build #
#########

FROM node:20-slim AS build

# Install PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy project files
COPY . /app
WORKDIR /app

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Run build
RUN pnpm run build

#########
# Serve #
#########

FROM nginx:alpine AS main

# Copy build
COPY --from=build /app/dist /usr/share/nginx/html
