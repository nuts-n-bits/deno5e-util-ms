dist_dir="./dist"
target_dir="../node_modules/lib-nnbc"

echo "rm -rf" $dist_dir
rm -fr $dist_dir

echo "tsc"
tsc

echo "rm -rf" $target_dir
rm -rf $target_dir

echo "mv" $dist_dir $target_dir
mv $dist_dir $target_dir

echo "done"