angular.module('ion-image-search').
    config(function($provide) {
        "use strict";

        var searchProviders = {
            Google: 'googleSearch',
            Bing: 'bingSearch',
            Flickr: 'flickrSearch'
        };

        var imgSizes = {
            small: 'small'
        };

        var fileTypes = {
            png: 'png',
            gif: 'gif',
            jpg: 'jpg'
        };

        var defaultConfiguration = {
            searchProviders: [searchProviders.Bing],
            imgSize: imgSizes.small,
            fileType: fileTypes.jpg,
            maxSuccessiveFails: 5
        };

        var googleParams = {
            address: 'https://www.googleapis.com/customsearch/v1?',
            key: 'AIzaSyDN8Ur44XBYXNXHw97YBasBBXWkPWxxqxA',
            customSearch: '',
            pageSize: 10
        };

        var bingParams = {
            address: 'https://api.datamarket.azure.com/Bing/Search/v1/Image?',
            key: 'NKagDQYH5P/JwXIawGcjea3z9AYwHEbCF3Qt6vYwzeo',
            auth: 'Basic',
            pageSize: 50
        };

        var flickrParams = {
            address: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&',
            key: '2fd0d8857638a98d44b71b1f4b7b9902',
            pageSize: 100
        };

        $provide.value('ionImageSearchProviders', searchProviders);
        $provide.value('ionImageSearchDefaultConfiguration', defaultConfiguration);
        $provide.value('googleParams', googleParams);
        $provide.value('bingParams', bingParams);
        $provide.value('flickrParams', flickrParams);

    });