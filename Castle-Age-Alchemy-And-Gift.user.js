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
        alert('����§�����ذe���o');
        remove_sub_panel('ca_gift');
    }
}

function receive(uid, num, gift) {
    if(num--)
        $.get("http://apps.facebook.com/castle_age/army.php?act=acpt&rqtp=gift&uid=" + uid, function() {
            if(display)
                get_sub_panel('ca_gift').text("�٦� " + num + " ��§���n�e...");
            send(uid, num, gift);
        });
}

function gift() {
    var ca_gift = get_sub_panel('ca_gift'),
        selectGift = $("<select></select>"),
        selectFreq = $("<select></select>"),
        inputID    = $("<input></input>"),
        buttonSub  = $("<button >�ذe</button>"),
        gifts      = ['�B�~: §���L�� (Gift Soldiers!)','�� 01 ��§�� (Volcanic Egg! - Shield of Dante)','�� 02 ��§�� (Mystery Ice Artifact! - Ice Orb)','�� 03 ��§�� (Mystery Earth! - Earth Orb)','�� 04 ��§�� (Mystery Relic! - Drake Helm)','�� 05 ��§�� (Mystery Item! - The Battle of the Dark Legion)','�� 06 ��§�� (Mystery Relic! - Serpentine Shield)','�� 07 ��§�� (Mystery Treasure! - Poseidons Horn)','�� 08 ��§�� (Serpent Egg! - Sea Serpent Quest)','�� 09 ��§�� (Dragon Egg! - Epic Dragon Quest)','�� 10 ��§�� (Mystery Druid Item! - Whisper Bow)','�� 11 ��§�� (Mystery Armor! - Golden Hand)','�� 12 ��§�� (Mystery Frost Item! - Frost Tear Dagger)','�� 13 ��§�� (Mystery Artifact! - Morningstar)','�� 14 ��§�� (Mystery Armor! - Mystic Armor)','�� 15 ��§�� (Mystery Frost Relic! - Glacial Blade)','�� 16 ��§�� (Mystery Fire Relic! - Ring of Bahamut)','�� 17 ��§�� (Limited Strider Set! - Assassins Blade)','�� 18 ��§�� (Lione Set! - Ring of Life)'],
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
                ca_gift.html("���b�ذe��...������N�|�q���z..");
                display = true;
            } else {
                alert("�䤣��z�� ID, CA �i���c����, �еy��A��");
                remove_sub_panel('ca_gift');
            }
        });
    });

    ca_gift.html("�бq�U����ܭn�ذe��§���M����<br/>");
    ca_gift.append(selectGift, selectFreq, buttonSub);

}

function do_alch(form, num) {
    if(num > 0 && form.size()) {
        var data = {}, id = form.attr("id");

        form.children("input").each(function() {
            data[this.name] = this.value;
        });

        if(display)
            get_sub_panel('ca_alch').text("�٦� " + num + " �Ӫ��~�n�X��...");

        $("<div></div>").load("alchemy.php div.results span.result_body, #"+id, data, function(responseText, textStatus, XMLHttpRequest) {
            var result = $(this), txt = $.trim(result.text());

            if(/You have created/.test(txt)) {
                setTimeout( function() {do_alch(result.children("form"), --num);}, 3000);
            } else if(txt == '') {
                setTimeout( function() {do_alch(form, num);}, 3000);
            } else {
                alert('�������~���X�����o, �����Ƥ����X���ѤU�� ' +num+ ' ��');
                remove_sub_panel('ca_alch');
            }
        });
    } else {
        alert('�������~���X�����o');
        remove_sub_panel('ca_alch');
    }
}

function alchemy() {
    var ca_alch = get_sub_panel('ca_alch'), divs = $("<div></div>");

    divs.load("alchemy.php div.statsT2 table div.alchemyRecipeBack", function(responseText, textStatus, XMLHttpRequest) {
        var selectReci = $("<select></select>"),
            selectFreq = $("<select></select>"),
            buttonSub  = $("<button>�X��</button>"),
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
            ca_alch.html("���b�X����...������N�|�q���z..");
            display = true;
        });
        ca_alch.html("�бq�U����ܭn�X�������~�P����<br/>");
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
        ca_sub_panel = $("<div id='"+id+"'>Ū����...�еy��~</div>").css({
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

GM_registerMenuCommand("�ڭn�e�ۤv§��!", gift );
GM_registerMenuCommand("�ڭn�X��!", alchemy);
