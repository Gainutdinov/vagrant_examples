/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 70.16774392120652, "KoPercent": 29.832256078793474};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0010538994278831678, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-0"], "isController": false}, {"data": [0.002555366269165247, 500, 1500, "http:\/\/highload.simpledevops.xyz\/"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1"], "isController": false}, {"data": [0.010638297872340425, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1"], "isController": false}, {"data": [0.006756756756756757, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-0"], "isController": false}, {"data": [0.0022522522522522522, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-2"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-0"], "isController": false}, {"data": [0.007633587786259542, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1"], "isController": false}, {"data": [8.865248226950354E-4, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php"], "isController": false}, {"data": [0.006118881118881119, 500, 1500, "http:\/\/highload.simpledevops.xyz\/sample-page\/"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-0"], "isController": false}, {"data": [0.008888888888888889, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12996, 3877, 29.832256078793474, 18758.453985841912, 0, 208386, 33986.0, 53154.749999999985, 130485.27, 20.308185623942283, 401.6376249581992, 16.60222632059462], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-0", 443, 0, 0.0, 13749.97065462754, 5000, 84184, 24046.200000000008, 38081.39999999997, 72491.40000000001, 0.7887095252253519, 0.3774098314066625, 0.5832874421153083], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/", 587, 142, 24.190800681431003, 25719.99488926748, 1046, 135011, 56713.000000000015, 81255.20000000001, 130331.88, 0.9476653046332277, 75.33832910119516, 0.306005359676922], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1", 443, 100, 22.573363431151243, 15592.051918735886, 91, 137801, 23497.60000000001, 44829.19999999996, 130421.4, 0.7800724076239312, 4.762678474029576, 0.5466810962086368], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1", 141, 30, 21.27659574468085, 14310.007092198568, 102, 73702, 31218.199999999997, 40231.100000000006, 72574.72000000003, 0.38226092425811564, 2.3658987037355836, 0.3117386763673283], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-0", 444, 0, 0.0, 12783.292792792794, 291, 71591, 21647.0, 29466.0, 48089.35, 0.7296103486354315, 0.3455625871958314, 0.2664787796773939], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php", 315, 110, 34.92063492063492, 25995.06666666667, 4406, 135206, 50392.00000000004, 68931.79999999997, 130362.59999999999, 0.7622707440488434, 63.2676800872195, 0.8807233072144691], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-0", 141, 0, 0.0, 14503.290780141846, 4883, 128235, 24258.6, 37764.60000000004, 95375.46000000098, 0.37208958650555096, 0.18132099967409177, 0.3185893384458267], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-1", 444, 95, 21.396396396396398, 14607.788288288293, 496, 135102, 24646.0, 44109.0, 130967.95, 0.7265979017030866, 3.3373792148610546, 0.2624299867076769], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php", 1018, 361, 35.46168958742633, 23550.222986247543, 4189, 206059, 39285.60000000004, 64556.29999999986, 137066.1299999996, 1.7240795312129527, 82.49806526638129, 1.7629032078802966], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-1", 328, 67, 20.426829268292682, 17235.371951219506, 1887, 131133, 28403.900000000027, 67980.95000000003, 130602.29999999999, 0.5492251404459105, 12.896737458242981, 0.4263055347410018], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-0", 156, 0, 0.0, 13289.955128205123, 5394, 50994, 23081.500000000007, 25926.500000000007, 46263.57000000006, 0.38387527006609545, 0.19081300045277597, 0.3293977787525038], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-2", 104, 11, 10.576923076923077, 15566.384615384617, 2199, 130775, 24964.0, 41860.75, 130774.55, 0.1896097503167759, 1.2696995015907164, 0.13384280508482302], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1", 156, 34, 21.794871794871796, 15920.692307692309, 3604, 130376, 30520.7, 41669.35000000001, 130321.85, 0.3932264227990664, 2.404861281344683, 0.3202964897294804], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-0", 328, 0, 0.0, 12844.762195121944, 5319, 75189, 20667.20000000002, 28926.850000000017, 47299.669999999925, 0.5394843319276038, 0.7863137692479127, 0.3399034628356151], "isController": false}, {"data": ["Test", 288, 288, 100.0, 435854.63194444426, 212492, 598598, 540706.1, 555960.8, 590036.8600000001, 0.4755127447322104, 296.00746076710277, 8.67690636186107], "isController": true}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php", 839, 428, 51.01311084624553, 19903.729439809333, 0, 159162, 42809.0, 68899.0, 137918.2, 1.317463059215175, 16.38797405214107, 1.1024408127954084], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php", 501, 236, 47.10578842315369, 22275.92614770459, 4107, 208386, 39538.20000000001, 53296.8, 141869.50000000015, 0.8744111687264489, 35.43232942764466, 0.8650760304656371], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-0", 131, 0, 0.0, 12476.763358778624, 5313, 82885, 19574.6, 25137.6, 70755.72000000026, 0.37419056297113024, 0.1794214515808837, 0.3184039674554185], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1", 131, 36, 27.480916030534353, 14116.740458015276, 409, 154556, 22584.6, 39946.6, 146831.20000000016, 0.39352693256270144, 2.326603603475053, 0.3133453506745532], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login", 564, 215, 38.12056737588652, 27485.06205673759, 788, 146492, 52106.5, 83704.5, 141418.95, 0.8845407680762336, 3.8291841160238325, 0.5631102659856434], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page", 339, 105, 30.97345132743363, 22162.035398230084, 4315, 148476, 39986.0, 53055.0, 144148.40000000008, 0.7682876251300309, 20.528386574032105, 0.9273515989561261], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php", 439, 142, 32.34624145785877, 25669.56264236902, 4265, 162055, 50493.0, 88142.0, 145525.40000000002, 0.8064871696893096, 23.515815383903508, 0.965859236069266], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php", 3227, 1428, 44.251626898047725, 16461.031298419573, 4081, 154760, 25402.600000000002, 44866.6, 130058.31999999999, 5.596746360033647, 73.38628926134048, 5.3349002098563085], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php", 299, 113, 37.792642140468224, 22786.963210702335, 4808, 164480, 35607.0, 55770.0, 139420.0, 0.7721788355853063, 16.62518868667617, 0.8865091003793748], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/sample-page\/", 572, 121, 21.153846153846153, 20904.44405594404, 216, 142562, 40046.4, 67671.1000000001, 130818.98999999999, 0.8962019525294986, 18.60153044207668, 0.3147955872237951], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-0", 225, 0, 0.0, 14506.160000000002, 4909, 77995, 25605.4, 41520.39999999999, 75623.40000000001, 0.45026835994252573, 0.21633987606613542, 0.37853224584352274], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1", 225, 59, 26.22222222222222, 17308.64888888889, 97, 135644, 37393.60000000001, 65060.09999999982, 130975.64, 0.4654559295982391, 2.7643132708467366, 0.36106572017927296], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1", 228, 44, 19.29824561403509, 15338.008771929812, 2196, 134215, 24119.999999999996, 41173.7, 133605.52, 0.43264578075485305, 2.7188516237262568, 0.3194643013861743], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-0", 228, 0, 0.0, 13540.912280701757, 5012, 77908, 21821.1, 40565.09999999998, 74776.55, 0.4292257558044312, 0.20706789391346583, 0.3357462721601916], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 79,337)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 79,426)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 172, 4.436419912303327, 1.3234841489689135], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 100, 2.5793139025019345, 0.7694675284702985], "isController": false}, {"data": ["403\/Forbidden", 10, 0.25793139025019346, 0.07694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 80,705)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["400\/Bad Request", 946, 24.4003095176683, 7.2791628193290245], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 56: http:\\\/\\\/highload.simpledevops.xyz\\\/wp-login.php?_wpnonce=${WPNONCE_g1}&amp;action=logout", 210, 5.416559195254062, 1.6158818097876269], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 11,723; actual size: 8,336)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 154, 3.972143409852979, 1.1849799938442598], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 57,449)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,116; actual size: 3,377)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["500\/Internal Server Error", 2071, 53.417590920815066, 15.935672514619883], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,356; actual size: 3,325)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 205, 5.287593500128966, 1.577408433364112], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,046; actual size: 4,105)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 70,945; actual size: 44,664)", 1, 0.025793139025019344, 0.007694675284702986], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12996, 3877, "500\/Internal Server Error", 2071, "400\/Bad Request", 946, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 56: http:\\\/\\\/highload.simpledevops.xyz\\\/wp-login.php?_wpnonce=${WPNONCE_g1}&amp;action=logout", 210, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 205, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 172], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/", 587, 142, "500\/Internal Server Error", 81, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 22, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 16, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 7], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1", 443, 100, "500\/Internal Server Error", 85, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 6, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1", 141, 30, "500\/Internal Server Error", 27, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php", 315, 110, "500\/Internal Server Error", 85, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 10, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 7, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 6, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 2], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-1", 444, 95, "500\/Internal Server Error", 82, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 8, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php", 1018, 361, "500\/Internal Server Error", 277, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 36, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 19, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 18, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 11], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-1", 328, 67, "500\/Internal Server Error", 53, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-2", 104, 11, "500\/Internal Server Error", 9, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 2, null, null, null, null, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1", 156, 34, "500\/Internal Server Error", 30, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php", 839, 428, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 56: http:\\\/\\\/highload.simpledevops.xyz\\\/wp-login.php?_wpnonce=${WPNONCE_g1}&amp;action=logout", 210, "500\/Internal Server Error", 171, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 15, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 12, "403\/Forbidden", 10], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php", 501, 236, "500\/Internal Server Error", 141, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 54, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 23, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 5], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1", 131, 36, "500\/Internal Server Error", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 1, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login", 564, 215, "500\/Internal Server Error", 182, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 16, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page", 339, 105, "500\/Internal Server Error", 93, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 4, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 2], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php", 439, 142, "500\/Internal Server Error", 115, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 12, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 6, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php", 3227, 1428, "400\/Bad Request", 946, "500\/Internal Server Error", 343, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 61, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 43, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 34], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php", 299, 113, "500\/Internal Server Error", 92, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 7, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/sample-page\/", 572, 121, "500\/Internal Server Error", 89, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 13, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 9, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 5], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1", 225, 59, "500\/Internal Server Error", 48, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 2, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1", 228, 44, "500\/Internal Server Error", 37, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 2, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
