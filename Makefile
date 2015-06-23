R:

	Rscript -e "rmarkdown::render('data/2015-6-23_vaccines.Rmd')"
	open data/2015-6-23_vaccines.html

R_deploy:

	cp data/2015-6-23_vaccines.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/2015-6-23_vaccines_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/2015-6-23_vaccines.html