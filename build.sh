dist_dir="./dist"
target1="../node5e/node_modules/lib-nnbc"
target2="../angular2/node_modules/lib-nnbc"

echo "rm -rf" $dist_dir
rm -rf $dist_dir

echo "tsc"
tsc

echo "rm -rf" $target1
rm -rf $target1
echo "rm -rf" $target2
rm -rf $target2

echo "cp -r" $dist_dir $target1
cp -r $dist_dir $target1
echo "cp -r" $dist_dir $target2
cp -r $dist_dir $target2

echo "rm -rf" $dist_dir
rm -rf $dist_dir

echo "done"
