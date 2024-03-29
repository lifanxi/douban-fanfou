.PHONY: all clean xpi

all:
	cp doubanfanfouplugin.user.js web/doufan_$(V1).user.js
	(unzip web/doufanplugin.xpi; \
	cp doubanfanfouplugin.user.js content/doufanplugin.js; \
	/bin/cp -f install.rdf.template install.rdf ; \
	sed -i -e "s/__VERSION__/$(V2)/" install.rdf ; \
	zip -r web/Doufan_$(V1).xpi chrome chrome.manifest install.rdf content/* ;\
	rm -rf chrome.manifest content install.rdf;)
	sha1sum web/Doufan_$(V1).xpi 
	(cp LICENSE web; \
	cd web; \
	zip Doufan_$(V1).zip Doufan_$(V1).xpi LICENSE; \
	rm LICENSE; \
    )
clean:
	rm -f web/doufan_*.user.js
	rm -f web/Doufan_*.xpi
	rm -f web/*.zip
	rm -f *.xpi
	rm -rf chrome.manifest content install.rdf chrome