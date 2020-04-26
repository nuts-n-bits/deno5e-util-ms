dist_dir="./dist"
target="../node_modules/lib-nnbc"

echo "rm -rf" $dist_dir
rm -fr $dist_dir

echo "tsc"
tsc

echo "rm -rf" -rf $target
rm -rf $target

echo "mv" $dist_dir $target
mv $dist_dir $target

echo "rm -rf" $dist_dir
rm -fr $dist_dir

echo "done"