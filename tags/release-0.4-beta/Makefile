.PHONY: all clean xpi

all:
	cp doubanfanfouplugin.user.js web/doufan_$(V1).user.js
	zip doufan-$(V2).zip doubanfanfouplugin.user.js LICENSE
	(cd web; \
	unzip Doufan.xpi; \
	mv temp.js content/doubanfanfouplugin.js; \
    sed -i -e "s/__VERSION__/$(VERSION)/" install.rdf ; \
	zip -r Doufan_$(V1).xpi chrome.manifest content install.rdf; \
	rm -rf chrome.manifest content install.rdf; \
	cd ..)


clean:
	rm -f web/doufan_*.user.js
	rm -f web/doufan-*.zip
	rm -f web/Doufan_*.xpi
	rm -f *.zip
	rm -rf web/chrome.manifest web/content web/install.rdf