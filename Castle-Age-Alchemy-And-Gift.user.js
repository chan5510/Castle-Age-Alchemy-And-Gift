// ==UserScript==
// @name           Castle Age Alchemy And Gift
// @namespace      Gift
// @include        http://apps.facebook.com/castle_age/*
// @require        http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js
// @version        1.08
// ==/UserScript==

var display = false, keepGoing= true;

function send(uid, num, gift) {
    if(num && keepGoing) {
        $.post("http://apps.facebook.com/castle_age/army.php?act=create&gift=" + gift, {'ids[]': uid}, function() {
            receive(uid, num, gift);
        });
    } else if(!num) {
        alert('全部禮物都贈送完囉');
        remove_sub_panel('ca_gift');
    }
}

function receive(uid, num, gift) {
    if(num--)
        $.get("http://apps.facebook.com/castle_age/army.php?act=acpt&rqtp=gift&uid=" + uid, function() {
            if(display)
                get_sub_panel('ca_gift').text("還有 " + num + " 個禮物要送...");
            send(uid, num, gift);
        });
}

function gift() {
    var ca_gift = get_sub_panel('ca_gift'),
        selectGift = $("<select></select>"),
        selectFreq = $("<select></select>"),
        inputID    = $("<input></input>"),
        buttonSub  = $("<button >贈送</button>"),
        gifts      = ['額外: 禮物兵種 (Gift Soldiers!)','第 01 項禮物 (Volcanic Egg! - Shield of Dante)','第 02 項禮物 (Mystery Ice Artifact! - Ice Orb)','第 03 項禮物 (Mystery Earth! - Earth Orb)','第 04 項禮物 (Mystery Relic! - Drake Helm)','第 05 項禮物 (Mystery Item! - The Battle of the Dark Legion)','第 06 項禮物 (Mystery Relic! - Serpentine Shield)','第 07 項禮物 (Mystery Treasure! - Poseidons Horn)','第 08 項禮物 (Serpent Egg! - Sea Serpent Quest)','第 09 項禮物 (Dragon Egg! - Epic Dragon Quest)','第 10 項禮物 (Mystery Druid Item! - Whisper Bow)','第 11 項禮物 (Mystery Armor! - Golden Hand)','第 12 項禮物 (Mystery Frost Item! - Frost Tear Dagger)','第 13 項禮物 (Mystery Artifact! - Morningstar)','第 14 項禮物 (Mystery Armor! - Mystic Armor)','第 15 項禮物 (Mystery Frost Relic! - Glacial Blade)','第 16 項禮物 (Mystery Fire Relic! - Ring of Bahamut)','第 17 項禮物 (Limited Strider Set! - Assassins Blade)','第 18 項禮物 (Lione Set! - Ring of Life)'],
        freq       = [10,20,50,100,200,500,1000,2000,5000];

    $.each(gifts, function(idx) {
        selectGift.append("<option value='" + idx + "'>" + this + "</option");
    });

    $.each(freq, function() {
         selectFreq.append("<option value='"+this+"'>"+this+"</option>");
    });

    buttonSub.click(function() {
        $("<div></div>").load("party.php span.linkwhite a", function() {
            if(/id=(\d+)/.test($(this).children().attr("href"))) {
                send(RegExp.$1, selectFreq.val(), $(":selected", selectGift).attr("value"));
                ca_gift.html("正在贈送中...完成後將會通知您..");
                display = true;
            } else {
                alert("找不到您的 ID, CA 可能繁忙中, 請稍後再試");
                remove_sub_panel('ca_gift');
            }
        });
    });

    ca_gift.html("請從下面選擇要贈送的禮物和次數<br/>");
    ca_gift.append(selectGift, selectFreq, buttonSub);

}

function do_alch(form, num) {
    if(num > 0 && form.size()) {
        var data = {}, id = form.attr("id");

        form.children("input").each(function() {
            data[this.name] = this.value;
        });

        if(display)
            get_sub_panel('ca_alch').text("還有 " + num + " 個物品要合成...");

        $("<div></div>").load("alchemy.php div.results span.result_body, #"+id, data, function(responseText, textStatus, XMLHttpRequest) {
            var result = $(this), txt = $.trim(result.text());

            if(/You have created/.test(txt)) {
                setTimeout( function() {do_alch(result.children("form"), --num);}, 3000);
            } else if(txt == '') {
                setTimeout( function() {do_alch(form, num);}, 3000);
            } else {
                alert('全部物品都合成完囉, 但材料不夠合成剩下的 ' +num+ ' 次');
                remove_sub_panel('ca_alch');
            }
        });
    } else {
        alert('全部物品都合成完囉');
        remove_sub_panel('ca_alch');
    }
}

function alchemy() {
    var ca_alch = get_sub_panel('ca_alch'), divs = $("<div></div>");

    divs.load("alchemy.php div.statsT2 table div.alchemyRecipeBack", function(responseText, textStatus, XMLHttpRequest) {
        var selectReci = $("<select></select>"),
            selectFreq = $("<select></select>"),
            buttonSub  = $("<button>合成</button>"),
            freq       = [1,2,3,4,5,10,20,50,100,200,500]
            ;

        divs.children().each(function(idx) {
            selectReci.append("<option value='"+$("form",$(this)).attr("id")+"'>"+$("div.recipeTitle", $(this)).text().replace(/RECIPES: Create | to join your army!/g,'')+"</option>");
        });

        $.each(freq, function() {
             selectFreq.append("<option value='"+this+"'>"+this+"</option>");
        });

        buttonSub.click(function() {
            do_alch($("#"+$(":selected", selectReci).attr("value"), divs), selectFreq.val());
            ca_alch.html("正在合成中...完成後將會通知您..");
            display = true;
        });
        ca_alch.html("請從下面選擇要合成的物品與次數<br/>");
        ca_alch.append(selectReci, selectFreq, buttonSub);
    });

}

function get_panel() {
    var ca_panel = $("#ca_gift_panel");
    if(!ca_panel.size()) {
        ca_panel = $("<div id='ca_gift_panel'></div>").css({
            position : 'absolute',
            top      : '130px',
            left     : '10px',
            padding  : '5px',
            border   : 'solid 1px black',
            background : 'white'
        });
        ca_panel.appendTo("#app_content_46755028429");
    }
    return ca_panel;
}

function remove_panel() {
    var ca_panel = get_panel();
    if(!ca_panel.children().size())
        ca_panel.remove();
}

function get_sub_panel(id) {
    var ca_sub_panel = $("#" + id);
    if(!ca_sub_panel.size()) {
        ca_sub_panel = $("<div id='"+id+"'>讀取中...請稍後~</div>").css({
            height   : '60px',
            width    : '300px',
            padding  : '5px',
            border   : 'solid 1px black',
            background : 'white'
        });
        get_panel().append(ca_sub_panel);
    }
    return ca_sub_panel;
}

function remove_sub_panel(id) {
    var ca_sub_panel = get_sub_panel(id);
    ca_sub_panel.remove();
    remove_panel();
}

GM_registerMenuCommand("我要送自己禮物!", gift );
GM_registerMenuCommand("我要合成!", alchemy);
