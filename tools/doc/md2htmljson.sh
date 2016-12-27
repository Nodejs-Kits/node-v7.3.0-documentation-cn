# tranform *.md files to *.html & *.json

node_version='v7.3.0'

api_dir='../../doc/api_zh/'
template_dir='../../doc/template.html'
html_dir='../../views/html/'
json_dir='../../views/json/'

md_lists=$(ls ${api_dir} | grep \.md | sed 's/\.md*//g')

function md2html {
	html_content=`node generate.js ${api_dir}${i}.md --format=html --template=${template_dir} --node-version=${node_version}`
	if [ "$i" == "_toc" ]; then
		echo $html_content > ${html_dir}index.html
	else
		echo $html_content > ${html_dir}${i}.html
	fi
}

function md2json {
	json_content=`node generate.js ${api_dir}${i}.md --format=json --template=${template_dir} --node-version=${node_version}`
	if [ "$i" == "_toc" ]; then
		echo $json_content > ${json_dir}index.json
	else
		echo $json_content > ${json_dir}${i}.json
	fi
}

function main {
	for i in $md_lists; do
		md2html
		md2json
	done
}

main
