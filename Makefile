R:

	Rscript -e "rmarkdown::render('data/2015-6-23_vaccines.Rmd')"
	open data/2015-6-23_vaccines.html

R_deploy:

	cp data/2015-6-23_vaccines.html /Volumes/www_html/multimedia/graphics/projectFiles/Rmd/
	rsync -rv data/2015-6-23_vaccines_files /Volumes/www_html/multimedia/graphics/projectFiles/Rmd
	open http://private.boston.com/multimedia/graphics/projectFiles/Rmd/2015-6-23_vaccines.html

map_acquire:

	rm -rf map/input/*;

	# download MA towns shapefile from MassGis
	cd map/input; curl http://wsgw.mass.gov/data/gispub/shape/state/townssurvey_shp.zip > townssurvey_shp.zip; unzip townssurvey_shp.zip

map_process:

	rm -rf map/output/*;

	# dissolve MA towns
	cd map/output; mapshaper \
		../input/TOWNSSURVEY_POLYM.shp \
		-dissolve \
		-simplify 0.5% \
		-o state.shp

	# # project towns to EPSG:26986
	# cd map/output; ogr2ogr \
	# 	-t_srs 'EPSG:26986' \
	# 	MA.shp \
	# 	MA_temp.shp

	# convert kinder_rates csv to geojson
	cd map/output; csvjson \
		../../data/output/kinder_rates.csv \
		--lat LAT \
		--lon LNG \
		-i 4 \
		> schools.json

	# # project kinder rates to EPSG:26986
	# cd map/output; ogr2ogr \
	# 	-t_srs 'EPSG:26986' \
	# 	kinder_rates.shp \
	# 	kinder_rates.json

	# # convert to topojson
	# cd map/output; topojson \
	# 	--width 800 \
	# 	-s 5 \
	# 	-p \
	# 	-o ma.json \
	# 	-- MA.shp kinder_rates.shp

	# convert to topojson
	cd map/output; topojson \
		-o ma.json \
		-p \
		-- state.shp schools.json
