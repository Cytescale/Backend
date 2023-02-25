echo ">>Stashing Branch Changes"
git stash
echo ">>Pulling Latest Branch Changes"
git pull
echo ">>Installing NodeJs Packages"
npm i
echo ">>Listing PM2 Nodes"
pm2 list
