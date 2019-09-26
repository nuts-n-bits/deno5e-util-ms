$dist_dir="./dist"
$target_dir="../node_modules/lib-nnbc"

echo "rm -rf" $dist_dir $target_dir
rm -fr $dist_dir $target_dir

echo "tsc"
tsc

echo "mv" $dist_dir $target_dir
mv $dist_dir $target_dir

echo "done"