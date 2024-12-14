FROM denoland/deno:2.1.4

WORKDIR /frontend

COPY . .

RUN deno install

EXPOSE 5173

CMD ["deno", "run", "dev", "--host"]
