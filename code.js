
var c_copyrights = "&copy; 2008, John Slegers";
var c_weekdays = new Array("Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo");
var c_months = new Array("JAN", "FEB", "MAA", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
var c_old_date = "Deze datum is ongeldig. De Gregoriaanse kalender werd pas gebruikt vanaf october 1582";
var c_chg_btn = "Wijzig";

var g_currentTime = new Date();
var g_this_year = g_currentTime.getFullYear();
var g_year = g_this_year;
var g_months = get_months(g_year);
var g_x, g_y;
var g_calendar_open = 0;

function get_months(p_year) {
    var months = new Array(12);
    months[0]= [c_months[0], 31, 0];
    months[1]= [c_months[1], 28, 0];
    months[2]= [c_months[2], 31, 0];
    months[3]= [c_months[3], 30, 0];
    months[4]= [c_months[4], 31, 0];
    months[5]= [c_months[5], 30, 0];
    months[6]= [c_months[6], 31, 0];
    months[7]= [c_months[7], 31, 0];
    months[8]= [c_months[8], 30, 0];
    months[9]= [c_months[9], 31, 0];
    months[10]= [c_months[10], 30, 0];
    months[11]= [c_months[11], 31, 0];
    if ((p_year % 4 == 0) && ((p_year % 100 != 0)||(p_year % 400 == 0))){
        months[1][1] = 29;
    }
    for (i = 0; i < 12; ++i){
        if(i == 0){
            months[i][2] = get_startpos();
        } else {
            months[i][2] = get_nextpos(months[i-1][2], months[i-1][1]);
        }
    }
    return months;
}

function get_startpos() {
    var startpos = g_year - 1201;
    return (startpos + parseInt(startpos/4) - parseInt(startpos/100) + parseInt(startpos/400))%7 + 1;
}


function get_nextpos(p_startpos, p_n_o_days) {
    return (p_startpos + p_n_o_days - 1) %7 +1;
}

function display_calendar() {
    var HTML_calendar = "";
    HTML_calendar += ("<table align='center' class='total'>");
    HTML_calendar += ("<tr>");
    HTML_calendar += ("<th colspan=4 valign=top class='year'>");
    HTML_calendar += ("<font ID='displayyear'>0</font>");
    HTML_calendar += ("</th>");
    HTML_calendar += ("</tr>");
    HTML_calendar += ("<tr>");
    for (month=0; month < 12; ++month) {
        HTML_calendar += ("<td>");
        HTML_calendar += display_calendar_month(month);	
        HTML_calendar += ("</td>");
        if ((month % 4 == 3) && (month != 11)){
            HTML_calendar += ("</tr>");
            HTML_calendar += ("<tr>");
        }
    }
    HTML_calendar += ("</tr>");
    HTML_calendar += ("<tr>");
    HTML_calendar += ("<th colspan=4 valign=top class='year'>");
    HTML_calendar += ("<form>");
    HTML_calendar += ("<input type='button' value=' < ' class='button' onclick='fill_calendar_all_months(g_year - 1)'>&nbsp;&nbsp;");
    HTML_calendar += ("<input type='text' class='year' ID='year' maxlength='4' size='4' value='"+g_year+"' onKeyPress='return checkEnter(event)'>");
    HTML_calendar += ("<input type='button' value='"+c_chg_btn+"' class='button' onclick='fill_calendar_all_months(parseInt(year.value))'>");
    HTML_calendar += ("&nbsp;&nbsp;<input type='button' class='button' value=' > ' onclick='fill_calendar_all_months(g_year + 1)'>");
    HTML_calendar += ("<form>");
    HTML_calendar += ("</th>");
    HTML_calendar += ("</tr>");
    HTML_calendar += ("</table>");
    return HTML_calendar;
}

function display_calendar_month(p_month) {
    var t_HTML_calendar = "";
    t_HTML_calendar += ("<table class='month'>"); 
    t_HTML_calendar += ("<tr>");
    t_HTML_calendar += ("<th rowspan='7' width='50' valign=top class='title'>"+g_months[p_month][0]+"</th>");
    for (day=0; day < 7; ++day) {
        t_HTML_calendar += ("<th width=25>"+c_weekdays[day]+"</th>");
    }
    t_HTML_calendar +=("</tr>");
    t_HTML_calendar +=("<tr>");
    var day_count = 42 - g_months[p_month][2] + 1;
    for (position = 1; position <= 42; ++position){
        t_HTML_calendar +=("<td class='this_month' id='"+p_month+"0000"+position+"'>0</td>");
        if ((position % 7 == 0)&&(position != 42)){
            t_HTML_calendar +=("</tr>");
            t_HTML_calendar +=("<tr>");
        }
    }
    t_HTML_calendar +=("</tr>");
    t_HTML_calendar += ("</table>");
    return t_HTML_calendar;
}

function fill_calendar_month(p_month) {
    var day_count = 42 - g_months[p_month][2] + 1;
    var ID;
    var position = 1;
    for (datum=-g_months[p_month][2]+2; datum <= day_count; ++datum){
        ID = p_month + "0000" + position;
        if (datum < 1){
            change_day(ID, datum + g_months[(month+11)%12][1], "other_month");
        }
        else if (datum > g_months[p_month][1]){
            change_day(ID, datum - g_months[p_month][1], "other_month");
        }
        else{
            change_day(ID, datum, "this_month");
        }
        position += 1;
    }
}
function change_day(p_ID, p_datum, P_classname) {
    document.getElementById(p_ID).innerHTML = p_datum;
    document.getElementById(p_ID).className = P_classname;
}

function change_year() {
    document.getElementById('year').value = g_year;
    document.getElementById('displayyear').innerHTML = g_year;
    document.getElementById('year').focus();
}

function fill_calendar_all_months(p_year) {
    if (p_year > 1582){
        g_year = p_year;
        g_months = get_months(g_year);
        change_year();
        for (month=0; month < 12; ++month) {
            fill_calendar_month(month, g_months[(month+11)%12][1]);
        }
        mark_current_day();
    } else {
        window.alert(c_old_date);
    }
    g_calendar_open = 1;
}

function mark_current_day() {
    var position, ID, month, day;
    if (g_this_year == g_year){
        month = g_currentTime.getMonth();
        day = g_currentTime.getDate();
        position = day + g_months[month][2] - 1;
        ID = month + "0000" + position;
        document.getElementById(ID).className = "today";
    }
}

function checkEnter(e){ //e is event object passed from function invocation
    var characterCode;
    if(e && e.which){ //if which property of event object is supported (NN4)
        e = e;
        characterCode = e.which; //character code is contained in NN4's which property
    } else{
        e = event;
        characterCode = e.keyCode; //character code is contained in IE's keyCode property
    }
    if(characterCode == 13){ //if generated character code is equal to ascii 13 (if enter key)
        fill_calendar_all_months(parseInt(document.getElementById("year").value));
        return false;
    }
}

function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getXY;
}

function getXY(e) {
    g_x = (window.Event) ? e.pageX : event.clientX;
    g_y = (window.Event) ? e.pageY : event.clientY;
}

document.write(display_calendar());
fill_calendar_all_months(g_year);
init;