//Imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static_v4';
const DYNAMI_CACHE = 'dynamic_v2';
const INMUTABLE_CACHE = 'inmutable_v1';

const APP_SHELL = [ // Mis desarrollos
	//'/',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/spiderman.jpg',
	'img/avatars/hulk.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'img/avatars/ironman.jpg',
	'js/app.js',
	'js/sw-utils.js'

];

const APP_SHEL_INMUTABLE = [ // Lo que no se modificara jamas

	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
];

self.addEventListener('install', e => {

		const cacheStatic = caches.open( STATIC_CACHE ).then(cache =>
			cache.addAll( APP_SHELL));

		const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache =>
			cache.addAll( APP_SHEL_INMUTABLE));

	e.waitUntil( Promise.all([ cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMI_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );


});

self.addEventListener( 'fetch', e => {

	const respuesta = caches.match( e.request ).then( res => {

		if ( res ) {
			return res;
		}else{
			return fetch(e.request).then( newRes => {
				return actualizaCacheDinamico (DYNAMI_CACHE, e.request, newRes);

			});
		}

	});

	e.respondWith( respuesta );

});


