echo ">>Installing NodeJs"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
echo "Checking Node Version"
node -e "console.log('Running Node.js ' + process.version)"
echo ">>Stashing Branch Changes"
git stash
echo ">>Pulling Latest Branch Changes"
git pull
echo ">>Installing NodeJs Packages"
npm i
echo ">>Listing PM2 Nodes"
pm2 list
