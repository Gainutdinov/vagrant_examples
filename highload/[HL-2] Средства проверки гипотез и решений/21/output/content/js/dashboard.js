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

    var data = {"OkPercent": 72.40107786129627, "KoPercent": 27.59892213870373};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [4.2265426880811494E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1"], "isController": false}, {"data": [0.004048582995951417, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-2"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-login.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/login"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php"], "isController": false}, {"data": [0.006211180124223602, 500, 1500, "http:\/\/highload.simpledevops.xyz\/sample-page\/"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-0"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7051, 1946, 27.59892213870373, 18470.3220819742, 0, 245170, 31913.0, 49528.39999999998, 130002.95999999999, 21.508164317372778, 397.7254141783902, 17.221872078316743], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-0", 316, 0, 0.0, 13467.174050632908, 6602, 97711, 21983.100000000024, 39345.29999999999, 73704.71, 1.1437547731854656, 0.5473045301375763, 0.8855948599352838], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/", 343, 78, 22.740524781341108, 31084.79008746357, 587, 245170, 57671.80000000002, 129646.0, 222348.60000000012, 1.0462771749906201, 84.76208549750784, 0.3099760564959171], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1", 316, 51, 16.139240506329113, 14721.670886075948, 13, 131161, 17950.200000000008, 44486.54999999996, 130605.65, 1.176891219497661, 7.488697066663811, 0.8411078431326907], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1", 47, 14, 29.78723404255319, 12223.042553191492, 374, 39909, 21322.600000000013, 38790.599999999984, 39909.0, 0.4733036595436144, 2.8446800857485246, 0.27768039666874783], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-0", 247, 0, 0.0, 13519.959514170047, 265, 75428, 21008.00000000002, 39472.99999999999, 74251.56000000003, 0.766183691764611, 0.36233235369613837, 0.2798366217968403], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php", 97, 39, 40.20618556701031, 19851.814432989686, 114, 51404, 29040.2, 43644.39999999998, 51404.0, 0.7237401698177965, 52.330754037462874, 0.6941502371741304], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-0", 47, 0, 0.0, 11487.404255319148, 8116, 19434, 15767.200000000004, 18354.399999999998, 19434.0, 0.42026950900002685, 0.20479930174903652, 0.35925672934196523], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-1", 247, 39, 15.789473684210526, 13237.145748987854, 3382, 130069, 22528.800000000003, 39904.799999999996, 99827.60000000011, 0.7588442218774483, 3.5623297064855066, 0.2720945934269344], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php", 586, 154, 26.27986348122867, 26544.941979522195, 5677, 147875, 49704.60000000007, 85090.15, 141156.81, 2.0502701038430318, 92.3257916861285, 2.250170618947155], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-1", 177, 35, 19.774011299435028, 13000.01129943503, 877, 130068, 17000.2, 24538.39999999998, 120314.87999999999, 0.5989766635984622, 11.270578322332353, 0.4468068219888732], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-0", 80, 0, 0.0, 13737.95, 8296, 74200, 20898.100000000024, 40045.50000000003, 74200.0, 0.6042113531313253, 0.30033552611703573, 0.5197604254780822], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-2", 82, 16, 19.51219512195122, 12928.70731707317, 6088, 117217, 16877.800000000003, 37991.19999999992, 117217.0, 0.3134700368518433, 1.9271717357065308, 0.21185583938292274], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1", 80, 21, 26.25, 14991.874999999995, 198, 87465, 25634.700000000004, 56964.3, 87465.0, 0.6493084864619181, 3.887655301400883, 0.45289901021037593], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-0", 177, 0, 0.0, 11148.26553672317, 6592, 41775, 15816.200000000008, 22637.299999999996, 41655.659999999996, 0.5550103006149012, 0.7430850802178023, 0.34591073329560096], "isController": false}, {"data": ["Test", 47, 47, 100.0, 294382.12765957444, 225766, 325931, 320925.2, 323643.2, 325931.0, 0.1433713623329876, 94.77599237481698, 2.531126551918736], "isController": true}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php", 352, 141, 40.05681818181818, 20812.053977272728, 0, 139027, 35473.9, 51471.999999999956, 131920.53999999995, 1.1006707212207438, 14.775617661543754, 1.160485002579697], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php", 294, 113, 38.435374149659864, 24894.085034013602, 272, 143922, 44412.5, 75517.75, 141133.30000000002, 1.093693036820999, 37.72833007325697, 1.125360640861339], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-0", 27, 0, 0.0, 13613.962962962962, 8381, 44413, 31254.19999999999, 44133.799999999996, 44413.0, 0.3884556728915489, 0.18626146034155325, 0.32867272699479183], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1", 27, 8, 29.62962962962963, 14099.62962962963, 4266, 39882, 26972.399999999994, 36697.999999999985, 39882.0, 0.4217827350267129, 2.470635695902459, 0.2719741970506452], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login", 319, 111, 34.79623824451411, 27275.442006269594, 895, 237889, 51988.0, 77886.0, 134674.60000000003, 0.9792395084770216, 4.224942912869172, 0.6003723613869593], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page", 154, 49, 31.818181818181817, 24169.96753246753, 1092, 130017, 50715.5, 74295.75, 120934.29999999981, 0.9796063763469589, 24.288816306311464, 1.0729726242955104], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php", 263, 60, 22.813688212927758, 25410.235741444878, 1724, 139281, 48986.4, 81166.39999999986, 133353.4800000001, 1.1374989727908515, 33.18229360394708, 1.3630245997668775], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php", 1771, 877, 49.520045172219085, 14731.307735742526, 192, 131167, 23673.599999999995, 40392.799999999996, 86649.91999999997, 6.409073308073406, 82.54449070982929, 5.864937646339301], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php", 70, 30, 42.857142857142854, 18074.271428571425, 396, 57940, 35732.5, 44698.10000000002, 57940.0, 0.5829689777222569, 12.013406334582552, 0.4951169841765563], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/sample-page\/", 322, 73, 22.67080745341615, 23674.267080745358, 195, 131029, 41960.99999999999, 77889.7, 130649.34999999999, 0.987754300719036, 20.05711485059449, 0.3332736117757491], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-0", 146, 0, 0.0, 12867.178082191784, 6085, 75000, 20560.70000000001, 25689.75, 63579.00000000003, 0.6915105242218138, 0.3322491971846996, 0.586237223632609], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1", 146, 20, 13.698630136986301, 16023.38356164384, 6821, 130043, 25301.2, 41109.65000000001, 130013.39, 0.7303286478915512, 4.79094010273373, 0.5644336826571957], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1", 159, 17, 10.69182389937107, 13313.635220125789, 6365, 130814, 17674.0, 23636.0, 130770.2, 0.6089154411764706, 4.06962002024931, 0.46379612941367954], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-0", 159, 0, 0.0, 12679.792452830188, 6885, 57631, 17247.0, 26625.0, 54256.600000000035, 0.6150727642685276, 0.2967245561998561, 0.49848108578717715], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 99,064)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 89,002)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 9,658)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 77, 3.9568345323741005, 1.0920436817472698], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,116; actual size: 7,232)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 349, 17.934224049331963, 4.949652531555808], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 41, 2.1068859198355603, 0.5814778045667282], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 60,185)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 91,738)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["400\/Bad Request", 571, 29.34224049331963, 8.098142107502483], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 56: http:\\\/\\\/highload.simpledevops.xyz\\\/wp-login.php?_wpnonce=${WPNONCE_g1}&amp;action=logout", 37, 1.9013360739979446, 0.5247482626577791], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 88,763)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 71, 3.6485097636176773, 1.0069493688838462], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,064; actual size: 7,953)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["500\/Internal Server Error", 640, 32.8879753340185, 9.076726705431854], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,019; actual size: 2,617)", 6, 0.30832476875642345, 0.08509431286342363], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,116; actual size: 641)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 142, 7.297019527235355, 2.0138987377676925], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 119,054; actual size: 61,403)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 8,046; actual size: 4,105)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException\/Non HTTP response message: Truncated chunk (expected size: 70,945; actual size: 44,664)", 1, 0.051387461459403906, 0.014182385477237271], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7051, 1946, "500\/Internal Server Error", 640, "400\/Bad Request", 571, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 349, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 142, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 77], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/", 343, 78, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 21, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 18, "500\/Internal Server Error", 17, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 9, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 7], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php-1", 316, 51, "500\/Internal Server Error", 35, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php-1", 47, 14, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit-comments.php", 97, 39, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 27, "500\/Internal Server Error", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 3, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login-1", 247, 39, "500\/Internal Server Error", 30, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 4, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 1], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php", 586, 154, "500\/Internal Server Error", 82, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 21, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 15, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 13, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 12], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-1", 177, 35, "500\/Internal Server Error", 20, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 7, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php-2", 82, 16, "500\/Internal Server Error", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page-1", 80, 21, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 13, "500\/Internal Server Error", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-login.php", 352, 141, "500\/Internal Server Error", 71, "Non HTTP response code: java.net.URISyntaxException\/Non HTTP response message: Illegal character in query at index 56: http:\\\/\\\/highload.simpledevops.xyz\\\/wp-login.php?_wpnonce=${WPNONCE_g1}&amp;action=logout", 37, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 16, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 9, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php", 294, 113, "500\/Internal Server Error", 37, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 33, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 8, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 7, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 6], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php-1", 27, 8, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 5, "500\/Internal Server Error", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1, null, null, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/login", 319, 111, "500\/Internal Server Error", 76, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 14, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 6], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/edit.php?post_type=page", 154, 49, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 33, "500\/Internal Server Error", 13, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php", 263, 60, "500\/Internal Server Error", 27, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 10, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 5, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 4], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/admin-ajax.php", 1771, 877, "400\/Bad Request", 571, "500\/Internal Server Error", 138, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 133, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 19, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 8], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/index.php", 70, 30, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 23, "500\/Internal Server Error", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException\/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, null, null], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/sample-page\/", 322, 73, "500\/Internal Server Error", 43, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 6, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 3], "isController": false}, {"data": [], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/upload.php-1", 146, 20, "500\/Internal Server Error", 10, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 3, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 2], "isController": false}, {"data": ["http:\/\/highload.simpledevops.xyz\/wp-admin\/post-new.php-1", 159, 17, "500\/Internal Server Error", 12, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to highload.simpledevops.xyz:80 [highload.simpledevops.xyz\\\/135.181.85.130] failed: Connection timed out (Connection timed out)", 2, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: highload.simpledevops.xyz:80 failed to respond", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
