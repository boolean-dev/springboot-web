/*
* 
 * 
 * 
 * 
 * JavaScript - List
 * 
 */

$().ready( function() {

	var $listForm = $("#listForm");
	var $searchForm = $("#searchForm");
	var $pageTotal = $("#pageTotal");
	var $deleteButton = $("#deleteButton");
	var $refreshButton = $("#refreshButton");
	var $pageSizeSelect = $("#pageSizeSelect");
	var $pageSizeOption = $("#pageSizeOption a");
	var $moreOperation = $("#moreOperation");
	var $searchPropertySelect = $("#searchPropertySelect");
	var $searchPropertyOption = $("#searchPropertyOption a");
	var $searchValue = $("#searchValue");
	var $listTable = $("#listTable");
	var $selectAll = $("#selectAll");
	var $ids = $("#listTable input[name='ids']");
	var $contentRow = $("#listTable tr:gt(0)");
	var $sort = $("#listTable a.sort");
	var $pageSize = $("#pageSize");
	var $searchProperty = $("#searchProperty");
	var $orderProperty = $("#orderProperty");
	var $orderDirection = $("#orderDirection");
	var $pageNumber = $("#pageNumber");
	
	// 删除
	$deleteButton.click( function() {
		var $this = $(this);
		if ($this.hasClass("disabled")) {
			return false;
		}
		var $checkedIds = $("#listTable input[name='ids']:enabled:checked");
		
		layer.confirm(message("admin.dialog.deleteConfirm"), {
			btn: [message("admin.dialog.ok"),message("admin.dialog.cancel")],
		}, function(){
			$.ajax({
				url: "delete.jhtml",
				type: "POST",
				data: $checkedIds.serialize(),
				dataType: "json",
				cache: false,
				success: function(message) {
					layer.msg(message.content, {icon: 1});
					if (message.type == "success") {
						$pageTotal.text(parseInt($pageTotal.text()) - $checkedIds.size());
						$checkedIds.closest("tr").remove();
						if ($listTable.find("tr").size() <= 1) {
							setTimeout(function() {
								location.reload(true);
							}, 3000);
						}
					}
					$deleteButton.addClass("disabled");
					$selectAll.prop("checked", false);
					$checkedIds.prop("checked", false);
				}
			});
		}, function(){
			//delete cancel
		});
	});
	
	// 刷新
	$refreshButton.click( function() {
		location.reload(true);
		return false;
	});
	
	// 每页记录数选项
	$pageSizeSelect.mouseover( function() {
		var $this = $(this);
		var offset = $this.offset();
		var $menuWrap = $this.closest("div.btn-group");
		$menuWrap.addClass("open");
		$menuWrap.mouseleave(function() {
			$menuWrap.removeClass("open");
		});
	});
	// 每页记录数
	$pageSizeOption.click( function() {
		var $this = $(this);
		$pageSize.val($this.attr("val"));
		$pageNumber.val("1");
		$listForm.submit();
		return false;
	});
	
	// 更多选项
	$moreOperation.mouseover( function() {
		var $this = $(this);
		var offset = $this.offset();
		var $menuWrap = $this.closest("div.menuWrap");
		var $popupMenu = $menuWrap.children("div.popupMenu");
		$popupMenu.css({left: offset.left, top: offset.top + $this.height() + 2}).show();
		$menuWrap.mouseleave(function() {
			$popupMenu.hide();
		});
	});
	
	// 搜索选项
	$searchPropertySelect.mouseover( function() {
		var $this = $(this);
		var offset = $this.offset();
		var $menuWrap = $this.closest("div.input-group-btn");
		$menuWrap.addClass("open");
		$menuWrap.mouseleave(function() {
			$menuWrap.removeClass("open");
		});
	});
	
	// 搜索选项
	$searchPropertyOption.click( function() {
		var $this = $(this);
		$searchProperty.val($this.attr("val"));
		$searchPropertyOption.removeClass("active");
		$this.addClass("active");
		$searchPropertySelect.text($this.text());
		return false;
	});
	
	// 全选
	$selectAll.click( function() {
		var $this = $(this);
		var $enabledIds = $("#listTable input[name='ids']:enabled");
		if ($this.prop("checked")) {
			$enabledIds.prop("checked", true);
			if ($enabledIds.filter(":checked").size() > 0) {
				$deleteButton.removeClass("disabled");
				$contentRow.addClass("selected");
			} else {
				$deleteButton.addClass("disabled");
			}
		} else {
			$enabledIds.prop("checked", false);
			$deleteButton.addClass("disabled");
			$contentRow.removeClass("selected");
		}
	});
	
	// 选择
	$ids.click( function() {
		var $this = $(this);
		if ($this.prop("checked")) {
			$this.closest("tr").addClass("selected");
			$deleteButton.removeClass("disabled");
		} else {
			$this.closest("tr").removeClass("selected");
			if ($("#listTable input[name='ids']:enabled:checked").size() > 0) {
				$deleteButton.removeClass("disabled");
			} else {
				$deleteButton.addClass("disabled");
			}
		}
	});
	
	// 排序
	$sort.click( function() {
		var orderProperty = $(this).attr("name");
		if ($orderProperty.val() == orderProperty) {
			if ($orderDirection.val() == "asc") {
				$orderDirection.val("desc")
			} else {
				$orderDirection.val("asc");
			}
		} else {
			$orderProperty.val(orderProperty);
			$orderDirection.val("asc");
		}
		$pageNumber.val("1");
		$listForm.submit();
		return false;
	});
	
	// 排序图标
	if ($orderProperty.val() != "") {
		$sort = $("#listTable a[name='" + $orderProperty.val() + "']");
		if ($orderDirection.val() == "asc") {
			$sort.removeClass("desc").addClass("asc");
		} else {
			$sort.removeClass("asc").addClass("desc");
		}
	}
	
	// 页码输入
	$pageNumber.keypress(function(event) {
		var key = event.keyCode ? event.keyCode : event.which;
		if ((key == 13 && $(this).val().length > 0) || (key >= 48 && key <= 57)) {
			return true;
		} else {
			return false;
		}
	});
	
	// 表单提交
	$listForm.submit(function() {
		if (!/^\d*[1-9]\d*$/.test($pageNumber.val())) {
			$pageNumber.val("1");
		}
		if ($searchValue.size() > 0 && $searchValue.val() != "" && $searchProperty.val() == "") {
			$searchProperty.val($searchPropertyOption.eq(0).attr("val"));
		}
		if($searchForm.length > 0){
			$("select", $searchForm).each(function(){
				//在listForm中append隐藏域，name同当前select,值取当前select
				var $this = $(this);
				addSearchVal2ListForm($this.attr("name"),$this.val());
			})
			$("input:not(:radio):not(:checkbox)", $searchForm).each(function(){
				//在listForm中append隐藏域，name同当前input,值取当前input
				var $this = $(this);
				addSearchVal2ListForm($this.attr("name"),$this.val());
			});
			$("#searchForm input:radio:checked,#searchForm input:checkbox:checked").each(function(){
				//在listForm中append隐藏域，name同当前input,值取当前input
				var $this = $(this);
				addSearchVal2ListForm($this.attr("name"),$this.val());
			});
		}
	});
	
	function addSearchVal2ListForm(name,value){
		$listForm.append('<input name="' + name + '"value="' + value + '" type="hidden"/>');
	}
	
	// 页码跳转
	$.pageSkip = function(pageNumber) {
		$pageNumber.val(pageNumber);
		$listForm.submit();
		return false;
	}
	
	// 列表查询
	if (location.search != "") {
		addCookie("listQuery", location.search);
	} else {
		removeCookie("listQuery");
	}

});