var SlimStat = {
    _id: "undefined" != typeof SlimStatParams.id ? SlimStatParams.id : "-1.0",
    _base64_key_str: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _plugins: {
        acrobat: {
            substrings: ["Adobe", "Acrobat"],
            active_x_strings: ["AcroPDF.PDF", "PDF.PDFCtrl.5"]
        },
        director: {
            substrings: ["Shockwave", "Director"],
            active_x_strings: ["SWCtl.SWCtl"]
        },
        flash: {
            substrings: ["Shockwave", "Flash"],
            active_x_strings: ["ShockwaveFlash.ShockwaveFlash"]
        },
        mediaplayer: {
            substrings: ["Windows Media"],
            active_x_strings: ["WMPlayer.OCX"]
        },
        quicktime: {
            substrings: ["QuickTime"],
            active_x_strings: ["QuickTime.QuickTime"]
        },
        real: {
            substrings: ["RealPlayer"],
            active_x_strings: ["rmocx.RealPlayer G2 Control", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)"]
        },
        silverlight: {
            substrings: ["Silverlight"],
            active_x_strings: ["AgControl.AgControl"]
        }
    },
    _utf8_encode: function(e) {
        var t, n, i = "";
        for (e = e.replace(/\r\n/g, "\n"), t = 0; t < e.length; t++) n = e.charCodeAt(t), 128 > n ? i += String.fromCharCode(n) : n > 127 && 2048 > n ? (i += String.fromCharCode(n >> 6 | 192), i += String.fromCharCode(63 & n | 128)) : (i += String.fromCharCode(n >> 12 | 224), i += String.fromCharCode(n >> 6 & 63 | 128), i += String.fromCharCode(63 & n | 128));
        return i
    },
    _base64_encode: function(e) {
        var t, n, i, a, r, s, o, l = "",
            d = 0;
        for (e = SlimStat._utf8_encode(e); d < e.length;) t = e.charCodeAt(d++), n = e.charCodeAt(d++), i = e.charCodeAt(d++), a = t >> 2, r = (3 & t) << 4 | n >> 4, s = (15 & n) << 2 | i >> 6, o = 63 & i, isNaN(n) ? s = o = 64 : isNaN(i) && (o = 64), l = l + SlimStat._base64_key_str.charAt(a) + SlimStat._base64_key_str.charAt(r) + SlimStat._base64_key_str.charAt(s) + this._base64_key_str.charAt(o);
        return l
    },
    _detect_single_plugin_not_ie: function(e) {
        var t, n, i, a;
        for (i in navigator.plugins) {
            t = "" + navigator.plugins[i].name + navigator.plugins[i].description, n = 0;
            for (a in SlimStat._plugins[e].substrings) - 1 != t.indexOf(SlimStat._plugins[e].substrings[a]) && n++;
            if (n == SlimStat._plugins[e].substrings.length) return !0
        }
        return !1
    },
    _detect_single_plugin_ie: function(e) {
        var t;
        for (t in SlimStat._plugins[e].active_x_strings) try {
            return new ActiveXObject(SlimStat._plugins[e].active_x_strings[t]), !0
        } catch (n) {
            return !1
        }
    },
    _detect_single_plugin: function(e) {
        return this.detect = navigator.plugins.length ? this._detect_single_plugin_not_ie : this._detect_single_plugin_ie, this.detect(e)
    },
    detect_plugins: function() {
        var e = "",
            t = [];
        for (e in SlimStat._plugins) SlimStat._detect_single_plugin(e) && t.push(e);
        return t.join(",")
    },
    get_page_performance: function() {
        return slim_performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}, "undefined" == typeof slim_performance.timing ? 0 : slim_performance.timing.loadEventEnd - slim_performance.timing.responseEnd
    },
    get_server_latency: function() {
        return slim_performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}, "undefined" == typeof slim_performance.timing ? 0 : slim_performance.timing.responseEnd - slim_performance.timing.connectEnd
    },
    send_to_server: function(e, t) {
        if ("undefined" == typeof SlimStatParams.ajaxurl || "undefined" == typeof e) return "function" == typeof t && t(), !1;
        try {
            window.XMLHttpRequest ? request = new XMLHttpRequest : window.ActiveXObject && (request = new ActiveXObject("Microsoft.XMLHTTP"))
        } catch (n) {
            return "function" == typeof t && t(), !1
        }
        return slimstat_data_with_client_info = e + "&sw=" + screen.width + "&sh=" + screen.height + "&bw=" + window.innerWidth + "&bh=" + window.innerHeight + "&sl=" + SlimStat.get_server_latency() + "&pp=" + SlimStat.get_page_performance() + "&pl=" + SlimStat.detect_plugins(), request ? (request.open("POST", SlimStatParams.ajaxurl, !0), request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), request.send(slimstat_data_with_client_info), request.onreadystatechange = function() {
            4 == request.readyState && ("undefined" == typeof SlimStatParams.id ? (parsed_id = parseInt(request.responseText), !isNaN(parsed_id) && parsed_id > 0 && (SlimStat._id = request.responseText)) : SlimStat._id = SlimStatParams.id, "function" == typeof t && t())
        }, !0) : !1
    },
    ss_track: function(e, t, n, i) {
        if (e || (e = window.event), type = "undefined" == typeof t ? 0 : parseInt(t), note_array = [], parsed_id = parseInt(SlimStat._id), isNaN(parsed_id) || parsed_id <= 0) return "function" == typeof i && i(), !1;
        if (node = "undefined" != typeof e.target ? e.target : "undefined" != typeof e.srcElement ? e.srcElement : !1, !node) return "function" == typeof i && i(), !1;
        switch (3 == node.nodeType && (node = node.parentNode), parent_node = node.parentNode, resource_url = "", node.nodeName) {
            case "FORM":
                node.action.length > 0 && (resource_url = node.action);
                break;
            case "INPUT":
                for (;
                    "undefined" != typeof parent_node && "FORM" != parent_node.nodeName && "BODY" != parent_node.nodeName;) parent_node = parent_node.parentNode;
                if ("undefined" != typeof parent_node.action && parent_node.action.length > 0) {
                    resource_url = parent_node.action;
                    break
                }
            default:
                if ("A" != node.nodeName) {
                    if ("function" == typeof node.getAttribute && "undefined" != node.getAttribute("id") && node.getAttribute("id").length) {
                        resource_url = node.getAttribute("id");
                        break
                    }
                    for (;
                        "undefined" != typeof node.parentNode && null != node.parentNode && "A" != node.nodeName && "BODY" != node.nodeName;) node = node.parentNode
                }
                "undefined" != typeof node.hash && node.hash.length > 0 && node.hostname == location.hostname ? resource_url = node.hash : "undefined" != typeof node.href && (resource_url = node.href), "function" == typeof node.getAttribute && ("undefined" != typeof node.getAttribute("title") && null != node.getAttribute("title") && node.getAttribute("title").length > 0 && note_array.push("Title:" + node.getAttribute("title")), "undefined" != typeof node.getAttribute("id") && null != node.getAttribute("id") && node.getAttribute("id").length > 0 && note_array.push("ID:" + node.getAttribute("id")))
        }
        return pos_x = -1, pos_y = -1, position = "", "undefined" != typeof e.pageX && "undefined" != typeof e.pageY ? (pos_x = e.pageX, pos_y = e.pageY) : "undefined" != typeof e.clientX && "undefined" != typeof e.clientY && "undefined" != typeof document.body.scrollLeft && "undefined" != typeof document.documentElement.scrollLeft && "undefined" != typeof document.body.scrollTop && "undefined" != typeof document.documentElement.scrollTop && (pos_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, pos_y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop), pos_x > 0 && pos_y > 0 && (position = pos_x + "," + pos_y), event_description = e.type, "click" != e.type && "undefined" != typeof e.which && (event_description += "keypress" == e.type ? "; keypress:" + String.fromCharCode(parseInt(e.which)) : "; which:" + e.which), "undefined" != typeof n && n.length > 0 && note_array.push(n), note_string = SlimStat._base64_encode(note_array.join(", ")), requested_op = "update", 1 == type && (resource_url = SlimStat._base64_encode(resource_url.substring(resource_url.indexOf(location.hostname) + location.hostname.length)), requested_op = "add"), SlimStat.send_to_server("action=slimtrack&op=" + requested_op + "&id=" + SlimStat._id + "&ty=" + type + "&ref=" + SlimStat._base64_encode(document.referrer) + "&res=" + resource_url + "&pos=" + position + "&des=" + SlimStat._base64_encode(event_description) + "&no=" + note_string, i), !0
    },
    add_event: function(e, t, n) {
        e && e.addEventListener ? e.addEventListener(t, n, !1) : e && e.attachEvent ? (e["e" + t + n] = n, e[t + n] = function() {
            e["e" + t + n](window.event)
        }, e.attachEvent("on" + t, e[t + n])) : e["on" + t] = e["e" + t + n]
    },
    event_fire: function(e, t) {
        var n = e;
        if (document.createEvent) {
            var i = document.createEvent("MouseEvents");
            i.initEvent(t, !0, !1), n.dispatchEvent(i)
        } else if (document.createEventObject) {
            var i = document.createEventObject();
            n.fireEvent("on" + t, i)
        }
    },
    in_array: function(e, t) {
        for (var n = 0; n < t.length; n++)
            if (t[n].trim() == e) return !0;
        return !1
    },
    in_array_substring: function(e, t) {
        for (var n = 0; n < t.length; n++)
            if (-1 != e.indexOf(t[n].trim())) return !0;
        return !1
    }
};
SlimStat.add_event(window, "load", function() {
    if ("undefined" == typeof SlimStatParams.disable_outbound_tracking) {
        all_links = document.getElementsByTagName("a");
        for (var e = "undefined" != typeof SlimStatParams.extensions_to_track && SlimStatParams.extensions_to_track.length > 0 ? SlimStatParams.extensions_to_track.split(",") : [], t = "undefined" != typeof SlimStatParams.outbound_classes_rel_href_to_ignore && SlimStatParams.outbound_classes_rel_href_to_ignore.length > 0 ? SlimStatParams.outbound_classes_rel_href_to_ignore.split(",") : [], n = "undefined" != typeof SlimStatParams.outbound_classes_rel_href_to_not_track && SlimStatParams.outbound_classes_rel_href_to_not_track.length > 0 ? SlimStatParams.outbound_classes_rel_href_to_not_track.split(",") : [], i = 0; i < all_links.length; i++)! function() {
            var a = all_links[i];
            if (a.slimstat_actual_click = !1, a.slimstat_type = !a.href || a.hostname != location.hostname && -1 != a.href.indexOf("://") ? 0 : 2, a.slimstat_track_me = !0, a.slimstat_callback = !0, 2 != a.slimstat_type || "undefined" != typeof SlimStatParams.track_internal_links && "false" != SlimStatParams.track_internal_links || (a.slimstat_track_me = !1), a.slimstat_track_me && (t.length > 0 || n.length > 0)) {
                classes_current_link = "undefined" != typeof a.className && a.className.length > 0 ? a.className.split(" ") : [];
                for (var r = 0; r < classes_current_link.length; r++)
                    if (SlimStat.in_array_substring(classes_current_link[r], t) && (a.slimstat_callback = !1), SlimStat.in_array_substring(classes_current_link[r], n)) {
                        a.slimstat_track_me = !1;
                        break
                    }
                a.slimstat_track_me && "undefined" != typeof a.attributes.rel && a.attributes.rel.value.length > 0 && (SlimStat.in_array_substring(a.attributes.rel.value, t) && (a.slimstat_callback = !1), SlimStat.in_array_substring(a.attributes.rel.value, n) && (a.slimstat_track_me = !1)), a.slimstat_track_me && "undefined" != typeof a.href && a.href.length > 0 && (SlimStat.in_array_substring(a.href, t) && (a.slimstat_callback = !1), SlimStat.in_array_substring(a.href, n) && (a.slimstat_track_me = !1))
            }
            e.length > 0 && 2 == a.slimstat_type && a.pathname.indexOf(".") > 0 && (extension_current_link = a.pathname.split(".").pop().replace(/[\/\-]/g, ""), a.slimstat_track_me = SlimStat.in_array(extension_current_link, e), a.slimstat_type = 1), a.slimstat_track_me && a.target && !a.target.match(/^_(self|parent|top)$/i) && (a.slimstat_callback = !1), a.setAttribute("data-slimstat-tracking", a.slimstat_track_me), a.setAttribute("data-slimstat-callback", a.slimstat_callback), SlimStat.add_event(a, "click", function(e) {
                this.slimstat_track_me && !this.slimstat_actual_click && (this.slimstat_callback ? ("function" == typeof e.preventDefault && e.preventDefault(), this.slimstat_actual_click = !0, SlimStat.ss_track(e, this.slimstat_type, "", function() {
                    SlimStat.event_fire(a, "click")
                })) : SlimStat.ss_track(e, this.slimstat_type, "", function() {}))
            })
        }()
    }
});
var slimstat_data = "action=slimtrack";
"undefined" != typeof SlimStatParams.id && parseInt(SlimStatParams.id) > 0 ? slimstat_data += "&op=update&id=" + SlimStatParams.id : "undefined" != typeof SlimStatParams.ci && (slimstat_data += "&op=add&id=" + SlimStatParams.ci + "&ref=" + SlimStat._base64_encode(document.referrer) + "&res=" + SlimStat._base64_encode(window.location.href)), slimstat_data.length && SlimStat.add_event(window, "load", function() {
    setTimeout(function() {
        SlimStat.send_to_server(slimstat_data)
    }, 0)
});