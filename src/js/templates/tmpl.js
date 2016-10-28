/*
 * JavaScript Templates Runtime
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global define, module */

;(function ($) {
    'use strict'
    var tmpl = function (id, data) {
        var f = tmpl.cache[id]
        return data ? f(data, tmpl) : function (data) {
        return f(data, tmpl)
        }
    }
    tmpl.cache = {'tmpl-credits':function(o,tmpl){var _e=tmpl.encode,_s='\n'; for (var i=0; i<o.length; i++) { _s+='\n'+_e(o[i].text)+' <a href="'+_e(o[i].linkurl)+'">'+_e(o[i].title)+'</a><br>\n'; } _s+='\n';return _s;},
        
                  'tmpl-feature-info':function(o,tmpl){var _e=tmpl.encode,_s='\n<div class="row row-horizon bottombar-content" id="feature-info">\n<div class="card card-actions col-xl-1 col-lg-1 col-md-1 col-ms-1 col-sm-2 col-xs-2">\n<div>\n<div class="btn-group-vertical" role="group">\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="Edit this feature" class="btn btn-warning btn-edit btn-round sidebar-link">\n<span class="fa fa-pencil"></span>\n</button>\n</div>\n<div class="btn-group btn-group-lg hidden-xs" role="group">\n<button type="button" title="Delete this feature" class="btn btn-danger btn-round btn-delete">\n<span class="fa fa-times"></span>\n</button>\n</div>\n'; if (o.amount) { _s+='\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="The garbage has been cleaned" class="btn btn-round btn-success btn-cleaned">\n<span class="fa fa-check"></span>\n</button>\n</div>\n'; } _s+='\n'; if (o.amount) { _s+='\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="Confirm there is garbage here" class="btn btn-round btn-info btn-confirm-garbage">\n<span class="fa fa-binoculars"></span>\n</button>\n<span class="badge badge-notify badge-notify-confirm">'+_e(o.confirms)+'</span>\n</div>\n'; } _s+='\n'; if (o.datetime) { _s+='\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="Say you will help" class="btn btn-round btn-info btn-attend-cleaning">\n<span class="fa fa-group"></span>\n</button><span class="badge badge-notify badge-notify-attend">'+_e(o.attends)+'</span>\n</div>\n'; } _s+='\n'; if (o.contact) { _s+='\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="Join game" class="btn btn-round btn-info btn-participate-game">\n<span class="fa fa-play"></span>\n</button><span class="badge badge-notify badge-notify-participate">'+_e(o.participant)+'</span>\n</div>\n'; } _s+='\n<div class="btn-group btn-group-lg" role="group">\n<button type="button" title="Share this" class="btn btn-round btn-default btn-social" data-toggle="popover" data-placement="top" data-trigger="focus">\n<span class="fa fa-share-alt"></span>\n</button>\n</div>\n</div>\n<div class="hidden" id="social-links"></div>\n</div>\n</div>\n<div class="card card-scroll card-data col-xl-2 col-lg-2 col-md-3 col-ms-3 col-sm-4 col-xs-6">\n<div><h3>Data</h3></div>\n<div class="feature-data-card">\n'; if (o.types) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">type:'+_e(o.types)+'</span>\n<span class="feature-info feature-info-garbage feature-info-litter feature-info-garbage-type pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.amount) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">amount:'+_e(o.amount)+'</span>\n<span class="feature-info feature-info-garbage feature-info-litter feature-info-garbage-amount pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.size) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">sizes:'+_e(o.size)+'</span>\n<span class="feature-info feature-info-garbage feature-info-litter feature-info-garbage-size pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.embed) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">in:'+_e(o.embed)+'</span>\n<span class="feature-info feature-info-garbage feature-info-litter feature-info-garbage-embed pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.physical_length) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">length:'+_e(o.physical_length)+'</span>\n<span class="feature-info feature-info-garbage feature-info-litter feature-info-litter-length pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.todo) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">todo:'+_e(o.todo)+'</span>\n<span class="feature-info-garbage feature-info feature-info-todo pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.note) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">note:'+_e(o.note)+'</span>\n<span class="feature-info feature-info-common feature-info-note pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.tags) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">note:'+_e(o.tags)+'</span>\n<span class="feature-info feature-info-common feature-info-tags pull-left">\n'; for (var i=0; i<o.tags.length; i++) { _s+='\n<span class="label label-default">'+_e(o.tags[i])+'</span>\n'; } _s+='\n</span>\n</div>\n</div>\n'; } _s+='\n'; if (o.datetime) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">time:'+_e(o.datetime)+'</span>\n<span class="feature-info feature-info-cleaning feature-info-time pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.datetime) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">location:</span>\n<span class="feature-info feature-info-cleaning feature-info-location pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.physical_length) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">length:'+_e(o.physical_length)+'</span>\n<span class="feature-info feature-info-litter feature-info-length pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.title) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">name:'+_e(o.title)+'</span>\n<span class="feature-info feature-info-area feature-info-name pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.contact) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">contact:'+_e(o.contact)+'</span>\n<span class="feature-info feature-info-area feature-info-contact pull-left"></span>\n</div>\n</div>\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">players:'+_e(o.players)+'</span>\n<span class="feature-info feature-info-area feature-info-players pull-left"></span>\n</div>\n</div>\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">results:<a href="'+_e(o.results_link)+'" class="game-results-modal-link" data-toggle="modal" data-target="#game-results-modal"> click here to view<a/></span>\n<span class="feature-info feature-info-area feature-info-results pull-left"></span>\n</div>\n</div>\n'; } _s+='\n</div>\n</div>\n'; if (o.image_url) { _s+='\n<div class="card card-scroll card-media col-xl-2 col-lg-2 col-md-3 col-ms-3 col-sm-4 col-xs-6">\n<div><h3>Media</h3></div>\n<a class="feature-image-link" href="'+(o.image_url==null?'':o.image_url)+'" target="_blank"><img src="'+(o.image_url==null?'':o.image_url)+'" alt="feature image" class="feature-image center-block"></a>\n</div>\n'; } _s+='\n<div class="card card-scroll card-track col-xl-2 col-lg-2 col-md-3 col-ms-3 col-sm-4 col-xs-6">\n<div><h3>Track changes</h3></div>\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">creation date:'+_e(o.created_at )+'</span>\n<span class="feature-info feature-info-created-at pull-left"></span>\n</div>\n</div>\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">created by:'+_e(o.created_by )+'</span>\n<span class="feature-info feature-info-created-by pull-left"></span>\n</div>\n</div>\n'; if (o.modifided_by) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">modified by:'+_e(o.modifided_by )+'</span>\n<span class="feature-info feature-info-modified-by pull-left"></span>\n</div>\n</div>\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">modified at:'+_e(o.modifided_at )+'</span>\n<span class="feature-info feature-info-modified-at pull-left"></span>\n</div>\n</div>\n'; } _s+='\n'; if (o.cleaned_by) { _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left">modified by:'+_e(o.cleaned_by )+'</span>\n<span class="feature-info feature-info-cleaned-by pull-left"></span>\n</div>\n</div>\n'; } _s+='\n<div class="panel panel-default">\n<div class="panel-body">\n<span class="pull-left"><a class="feature-info-report" href="#">Report</a></span>\n</div>\n</div>\n</div>\n'; if (o.date) { _s+='\n<div class="card card-minimap col-xl-2 col-lg-2 col-md-3 col-ms-3 col-sm-4 col-xs-6">\n<div><h3>Access minimap</h3></div>\n<div id ="minimap" class="cleaning-minimap-card"></div>\n</div>\n'; } _s+='\n</div>\n';return _s;},
        
                  'tmpl-modal-cleaning':function(o,tmpl){var _e=tmpl.encode,_s='\n'; for (var i=0; i<o.length; i++) { _s+='\n<tr class="modal-calendar-row">\n<td>'+_e(o[i].id)+'</td>\n<td>'+_e(o[i].datetime)+'</td>\n<td>'+_e(o[i].latlng)+'</td>\t\t\n</tr>\n'; } _s+='\n';return _s;},
        
                  'tmpl-modal-garbage':function(o,tmpl){var _e=tmpl.encode,_s='\n'; for (var i=0; i<o.length; i++) { _s+='\n<tr class="modal-data-row">\n<td>'+_e(o[i].id)+'</td>\t\t\n<td>'+_e(o[i].latlng)+'</td>\t\t\n<td>'+_e(o[i].amount)+'</td>\n<td>'+_e(o[i].types)+'</td>\n</tr>\n'; } _s+='\n';return _s;},

                  'tmpl-social-links':function(o,tmpl){var _e=tmpl.encode,_s='\n'; for (var i=0; i<o.length; i++) { _s+='\n<div class="btn-group btn-group-lg" role="group">\n<a href="'+_e(o[i].targeturl)+'" target="_blank" title="'+_e(o[i].title)+'" class="btn '+_e(o[i].btnclass)+' btn-round btn-share"><span class="fa '+_e(o[i].iconclass)+'"></span></a>\n</div>\n'; } _s+='\n';return _s;},        
        
                  'tmpl-form-garbage-type':function(o,tmpl){var _e=tmpl.encode,_s='\n'; for (var i=0; i<o.length; i++) { _s+='\n<option value="'+_e(o[i].short)+'">'+_e(o[i].long)+'</option>\n'; } _s+='\n';return _s;}
    }
    tmpl.encReg = /[<>&"'\x00]/g
    tmpl.encMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
    }
    tmpl.encode = function (s) {
    return (s == null ? '' : '' + s).replace(
        tmpl.encReg,
        function (c) {
            return tmpl.encMap[c] || ''
        }
    )}
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return tmpl
    })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = tmpl
    } else {
        $.tmpl = tmpl
    }
}(this));