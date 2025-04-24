# Google Docs Preview on Discord

Googleドライブのファイルとかを自分のGoogle権限でプレビューするDiscord Botなのだ！

## 概要

![image](https://github.com/user-attachments/assets/129af0f5-a8c0-4cf6-8e29-58f6d8cda6aa)

1. DiscordでGoogleドライブのファイルを貼る
2. Botがチャットを受け取る
3. GoogleドライブのURLを抽出してGASに送信する
4. GASで中身を取得して、送り返す
5. Botがチャットで中身を送る

## 準備

### GAS

GASにコードとマニフェストを貼り付ける

```
root/
　┗ GAS/
    ┗ appscript.json
    ┗ code.gs
```

### Discord Bot

Discord Developer PortalにBotを登録する

`Message Content Intent`を有効にする

### トークンとエンドポイントの設定

Discord Botのトークンと、GASのデプロイURLを取得する貼り付ける

### Renderなどにデプロイ

リポジトリをフォークして、Renderなどでデプロイする

[https://dashboard.render.com/](https://dashboard.render.com/)

環境変数としてDiscord Botのトークンと、GASのデプロイURLを貼り付ける

```
DISCORD_TOKEN=Discord Botのトークン
GAS_ENDPOINT=GASのデプロイURL
```

### そして…

動く！
