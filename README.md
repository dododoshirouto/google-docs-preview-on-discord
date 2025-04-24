# Google Docs Preview on Discord

Googleドライブのファイルとかを自分のGoogle権限でプレビューするDiscord Botなのだ！

## 概要

1. DiscordでGoogleドライブのファイルを貼る
2. Botがチャットを受け取る
3. GoogleドライブのURLを抽出してGASに送信する
4. GASで中身を取得して、送り返す
5. Botがチャットで中身を送る

## 準備

### Nodeの初期化

`_install.bat`を実行する

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

### トークンとエンドポイントの設定

Discord Botのトークンと、GASのデプロイURLを貼り付ける

### Renderなどにデプロイ

`_deploy.bat`を実行する
