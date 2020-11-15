# 作成手順

1. LINE ログインチャネルを作成し、LIFFを作成する（LIFFのエンドポイントURLは仮URLを入力して、LIFF IDをメモする）  
https://developers.line.biz/ja/services/line-login/

2. Google Cloud のプロジェクトを新規作成する  
https://console.cloud.google.com/cloud-resource-manager?hl=ja&_ga=2.177002531.707716914.1602916550-1618091733.1601092088

3. Cloud Build を有効にする  
https://console.cloud.google.com/marketplace/product/google/cloudbuild.googleapis.com?returnUrl=%2Fcloud-build%3Fhl%3Dja%26organizationId%3D0%26project%3Dvscode-293013&hl=ja&organizationId=0

4. 下記リポジトリをForkする  
https://github.com/mochan-tk/vscode-gcp-line.git

5. Github Codespaces を作成する  

6. GCPにログインし、SDKを承認します  
gcloud init

7. Cloud Storage を作成（バケット名は一意になるようにして、[gs://]以外をメモします）し公開する  
gsutil mb -b on -l asia-northeast1 gs://xxx-image-bucket  
gsutil iam ch allUsers:objectViewer gs://xxx-image-bucket

8. Cloud Code の拡張機能 Cloud Run Explorer から Cloud Run を有効にする  

9. Cloud Code の拡張機能 から Deploy to Cloud Run を選択する  
regionに「asia-northeast1 (Tokyo)」を選択  
Show Advanced Settings > ENVIRONMENT VARIABLES で下記を入力  
MY_LIFF_ID:xxx  
GCLOUD_STORAGE_BUCKET:xxx

10. 「Deploy」ボタンを押す  
「Make sure all fields are correct to continue」と出る時あるがもう1度ボタンを押す  

11. Cloud Run にデプロイが完了したら、URLが発行されるので、LIFFのエンドポイントURLをかきかえます  

12. LIFF URL から動作確認します  



