var resCount = 0;

function getInfo(buttonId) {
    var xcpid = buttonId.replace('BUTTON_', '')
    if (!$('#BUTTON_' + buttonId).hasClass("done")) {
        $.ajax('data/activity.xcp.data.php?xcpid=' + xcpid)
            .done(function (e) {
                if (e != 'ERROR') {
                    $('#BUTTON_' + buttonId + ' > ul > div').hide()
                    $('#BUTTON_' + buttonId + ' > ul > .nextContent').before(e);
                    $('#BUTTON_' + buttonId).addClass('done');
                    $('#BUTTON_' + buttonId + ' > ul > .current > a').html('<i class="fa fa-bullseye"></i> ' + $('#row_' + buttonId).parents('tr').find('span.status').text().substring(8))
                }
                else {
                    alert(e);
                }
            });
    }
}

function testOut(no) {
    $.ajax('data/activity.change.php?xcpid=' + no.id + '&status=' + no.value)
        .done(function (e) {
            if (e == 'OK') {
                refreshTrackerTables();
            } else {
                alert(e);
            }
        });
}

function changeStage(xcpid, stage) {
    var currentAct = $('#row_' + xcpid).parents('tr').find('.stage').text().substr(0, 2);
    var currentStatus = $('#row_' + xcpid).parents('tr').find('.stage').text().substr(3,2);
    var targetAct = stage.substring(0, 2);
    
    $.ajax('data/activity.data.lookup.php?type=getAction&key='+currentAct+','+currentStatus+'|' + stage.replace(":",",") + '|' + $('#row_' + xcpid ).parents('tr').find( '.pipeline' ).text())
        .done(function (e) {
            var actionId = e;
            console.log( actionId );
            if ( actionId ) {
                alert( 'Action Required: ' + actionId);
                return false;
            }

            $('#row_' + xcpid).parents('tr').animate({'backgroundColor': '#62C5A7'})
            if (currentAct != targetAct) {
                $.ajax('data/activity.change.php?xcpid=' + xcpid + '&status=' + stage)
                .done(function (e) {
                    if (e == 'OK') {
                     console.log(window.tasks_mine);
                        window.tasks_mine.row($('#row_' + xcpid).parents('tr')).remove().draw();
                    } else {
                        $('string/element/array/function/jQuery object/string, context')('#row_' + xcpid).parents('tr').animate({
                            'backgroundColor': '#E28686'
                        });
                        alert(e);
                    }
                })
                .fail(function () {
                    $('#row_' + xcpid).parents('tr').animate({'backgroundColor': '#E28686'});
                });
            } else {
                $.ajax('data/activity.change.php?xcpid=' + xcpid + '&status=' + stage)
                .done(function (e) {
                    if (e == 'OK') {
                        $.ajax('data/activity.data.lookup.php?type=persistantAssignment&key='+currentAct+','+currentStatus+'|' + stage.replace(":",",") + '|' + $('#row_' + xcpid ).parents('tr').find( '.pipeline' ).text())
                            .done(function (e) {
                                if( e == 1) {
                                    setAsNow(xcpid)
                                    window.tasks_mine.cell($('#row_' + xcpid).parents('tr').find('span.status').parents('td')).data(
                                    '<span class="status" title=""><span class="stage">' + stage + '</span> - <i class="fa fa-spinner fa-pulse"></i></span>'
                                    );
                                    setStatusData(xcpid, stage);
                                    $('#BUTTON_' + xcpid).removeClass('done');
                                    $('#row_' + xcpid).parents('tr').find('li.actionMenu').remove()
                                    $('#row_' + xcpid).parents('tr').find('div.nextContent').show()
                                    $('#BUTTON_' + xcpid + ' > ul > .current > a').html('<i class="fa fa-bullseye"></i> <i class="fa fa-spinner fa-pulse"></i>')
                                } else if(e == 0) {
                                    var row = window.tasks_mine.row($('#row_' + xcpid).parents('tr'));
                                    rowNode = row.node();
                                    if ($(rowNode).find('td').length == 9) {
                                      $(rowNode).find('time').parent().before('<td>TODO</td>')
                                    }
                                    $(rowNode).find('.dropdown').html('<button id="' + xcpid + '"  class="btn btn-warning btn-sm pull-right" ><i class="fa fa-check-square-o"></i> CLAIM</button>')
                                    row.remove().draw();
                                    window.tasks_team.row.add(rowNode).draw();
                                    $(rowNode).find('#' + xcpid).click(function( e ) {
                                        e.preventDefault();
                                        console.log( e.target.id );
                                        claim( e.target.id );
                                    }); 
                                }
                            })
                    } else {
                        $('#row_' + xcpid).parents('tr').css('backgroundColor', '#E28686')
                        alert("Something went wrong:\n\n" + e);
                    }
                })
                .fail(function (e) {
                    $('#row_' + xcpid).parents('tr').css('backgroundColor', '#E28686');
                    alert("Something went wrong:\n\n" + e);
                });
            }

            setTimeout(function () {
                $('#row_' + xcpid).parents('tr').animate({'backgroundColor': ''})
            }, 1000);
    });
}

function setAsNow(xcpid, loc) {
    var d = new Date();
    switch (loc) {
    case 'mine':
        window.tasks_mine.cell($('#row_' + xcpid).parents('tr').find('time').parents('td')).data(
            '<time class="timeago" title="' + d.toISOString() + '" datetime="' + d.toISOString() + '">' + d.toISOString() + '</time>'
        );
        break;
    case 'team':
        window.tasks_team.cell($('#row_' + xcpid).parents('tr').find('time').parents('td')).data(
            '<time class="timeago" title="' + d.toISOString() + '" datetime="' + d.toISOString() + '">' + d.toISOString() + '</time>'
        );
        break;
    }
    $("time.timeago").timeago();
}

function refresh() {
    $('#refreshButton > a > i').addClass('fa-spin');
    refreshTrackerTables();
}

function setStatusData(xcpid, status) {
    $.ajax('data/activity.data.lookup.php?type=statusName&key=' + status.replace(":", ","))
        .done(function (Name) {
            $.ajax('data/activity.data.lookup.php?type=statusDescription&key=' + status.replace(":", ","))
                .done(function (Description) {
                    window.tasks_mine.cell($('#row_' + xcpid).parents('tr').find('span.status').parents('td')).data(
                        '<span class="status" title="' + Description + '"><span class="stage">' + status + '</span> - ' + Name + '</span>'
                    );
                });
        });
}

function prepButtons() {

    $( '.claimButton' ).unbind();
    $( '.claimButton' ).click(function( e ) {
        e.preventDefault();
        console.log( e.target.id );
        claim( e.target.id );
    });        

}

function claim(xcpid) {
    $('#row_' + xcpid).parents('tr').animate({
        'backgroundColor': '#62C5A7'
    })
    $.ajax('data/activity.claim.php?xcpid=' + xcpid)
        .done(function (e) {
            if (e == 'OK') {
                setAsNow(xcpid, 'team')
                var row = window.tasks_team.row($('#row_' + xcpid).parents('tr'));
                rowNode = row.node();
                $(rowNode).find('button').parent().html(
                    '<div class="dropdown" id="BUTTON_' + xcpid + '">' +
                    '<button onclick="getInfo(\'' + xcpid + '\')" class="btn btn-success btn-sm dropdown-toggle pull-right" type="button" id="actionMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
                    'Select stage <span class="caret"></span></button>' +
                    '<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="actionMenu">' +
                    '<li class="disabled current"><a href="#"><i class="fa fa-bullseye"></i> <i class="fa fa-spinner fa-pulse"></i></a></li>' +
                    '<li role="separator" class="divider"></li>' +
                    '<li class="dropdown-header">Select next stage</li><div style="margin-left: 1.5em;" class="nextContent"><i class="fa fa-spinner fa-pulse"></i></div>' +
                    '<li role="separator" class="divider"></li>' +
                    '<li><a href="javascript:void(0)" onclick="unassign(\'' + xcpid + '\')"><i class="fa fa-undo"></i> Unclaim item</a></li>' +
                    '</div>')
                row.remove().draw();
                window.tasks_mine.row.add(rowNode).draw();
            }
            else {
                $('#row_' + xcpid).parents('tr').animate({
                    'backgroundColor': '#E28686'
                })
                alert(e);
            }
        });
    setTimeout(function () {
        $('#row_' + xcpid).parents('tr').animate({
            'backgroundColor': ''
        });
    }, 1000);
}

function unassign(xcpid) {
    $('#row_' + xcpid).parents('tr').animate({
        'backgroundColor': '#62C5A7'
    })
    $.ajax('data/activity.unassign.php?xcpid=' + xcpid)
        .done(function (e) {
            if (e == 'OK') {
                setAsNow(xcpid, 'mine')
                var row = window.tasks_mine.row($('#row_' + xcpid).parents('tr'));
                rowNode = row.node();
                if ($(rowNode).find('td').length == 9) {
                    $(rowNode).find('time').parent().before('<td>TODO</td>')
                }
                $(rowNode).find('.dropdown').html('<button id="' + xcpid + '"  class="btn btn-warning btn-sm pull-right" ><i class="fa fa-check-square-o"></i> CLAIM</button>')
                row.remove().draw();
                window.tasks_team.row.add(rowNode).draw();
                $(rowNode).find('#' + xcpid).click(function( e ) {
                    e.preventDefault();
                    console.log( e.target.id );
                    claim( e.target.id );
                }); 
            }
            else {
                $('#row_' + xcpid).parents('tr').animate({
                    'backgroundColor': '#E28686'
                })
                alert(e);
            }
        });
    setTimeout(function () {
        $('#row_' + xcpid).parents('tr').animate({
            'backgroundColor': ''
        });
    }, 1000);
}

function refreshTrackerTables() {

    $('#tasks_team_panel').fadeOut("fast");
    $('#tasks_mine_panel').fadeOut("fast");
    $('#tasks_mine_panel_test').fadeIn("fast");
    window.tasks_team = $('#tasks_team').DataTable().ajax.url('data/activity.data.php?type=team&stream=' + $('#select_Pipeline').val() + '&feed=' + $('#select_feed').val() + '&act=' + $('#select_act').val()).load(function () {
        resCount++;
        showTables();
    });
    window.tasks_mine = $('#tasks_mine').DataTable().ajax.url('data/activity.data.php?type=mine&stream=' + $('#select_Pipeline').val() + '&feed=' + $('#select_feed').val() + '&uid=' + $('#uid').val() + '&act=' + $('#select_act').val()).load(function () {
        if ($("#uid").val() == 0) {
            tasks_mine.column(4).visible(true);
        }
        else {
            tasks_mine.column(4).visible(false);
        }
        resCount++;
        showTables();
        $('#refreshButton > a > i').removeClass('fa-spin');
    });
    getCounts();

}

function showTables() {
    if (resCount == 2) {
        $('#tasks_mine_panel_test').fadeOut("fast");
        $('time.timeago').timeago();
        $('#tasks_mine_panel').fadeIn("fast");
        $('#tasks_team_panel').fadeIn("fast");
        resCount = 0;
    }
}

function setTrackerTables() {
    window.tasks_team = $('#tasks_team').DataTable({
        "ajax": 'data/activity.data.php?type=team&stream=' + $('#select_Pipeline').val() + '&feed=' + $('#select_feed').val() + '&act=' + $('#select_act').val()
        , "bAutoWidth": false
        , "order": [
            [5, "desc"]
        ]
        , "lengthMenu": [5, 10, 25, 50, 75, 100]
        , "columnDefs": [{
            "orderable": false
            , "targets": 9
        }]
        , "pageLength": 5
        , "dom": 'rtl<"panel-footer foot-sm"fp>'
        , "language": {
            "emptyTable": "No items in this queue."
            , "sLoadingRecords": "loading..."
        }
    }).on('draw.dt', function () {
        $("time.timeago").timeago();
        prepButtons()
    });

    window.tasks_mine = $('#tasks_mine').DataTable({
        "ajax": 'data/activity.data.php?type=mine&stream=' + $('#select_Pipeline').val() + '&feed=' + $('#select_feed').val() + '&uid=' + $('#uid').val() + '&act=' + $('#select_act').val()
        , "bAutoWidth": false
        , "order": [
            [5, "desc"]
        ]
        , "lengthMenu": [5, 10, 25, 50, 75, 100]
        , "columnDefs": [{
            "orderable": false
            , "targets": 9
        }, {
            "visible": false
            , "targets": 4
        }]
        , "pageLength": 5
        , "dom": 'rtl<"panel-footer foot-sm"fp>'
        , "language": {
            "emptyTable": "No items in this queue."
            , "sLoadingRecords": "loading..."
        }
    }).on('draw.dt', function () {
        $("time.timeago").timeago();
        prepButtons()
    });

}

function getCounts() {
    $('#refreshButton > a > i').addClass('fa-spin');
    $.ajax('data/activity.count.php?type=team&stream=' + $('#select_Pipeline').val() + '&uid=' + $('#uid').val() + '&feed=' + $('#select_feed').val())
        .done(function (e) {
            $("span[class*='label'][id*='_']").fadeOut('fast', function () {
                $("span[class*='label'][id*='_']").html('0')
                e.aaData.forEach(function (i) {
                    $('#m_' + i[0]).html(i[1]);
                    $('#b_' + i[0]).html(i[2]);
                })
            });
            $("span[class*='label'][id*='_']").fadeIn('fast');
            $('#refreshButton > a > i').removeClass('fa-spin');
        });
}

function setActivity(act) {
    $('.act_list_item').removeClass('active');
    $('#' + act).addClass('active');
    $('#select_act').val(act);
    refreshTrackerTables();
}

$(function(){ 

    $('#10').addClass('active');
    $('#select_act').val(10);

    setTrackerTables();
    getCounts();

    $("#select_Pipeline").change(function () {
        refreshTrackerTables();
    });

    $("#uid").change(function () {
        refreshTrackerTables();
    });

    $("#select_feed").change(function () {
        refreshTrackerTables();
    });

    $('#updateData').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget) // Button that triggered the modal
          var recipient = button.data('xcpid') // Extract info from data-* attributes
          // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
          // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
          var modal = $(this)
          modal.find('.modal-title').text('Update data for ' + recipient)
          modal.find('.modal-body input').val(recipient)
})


});