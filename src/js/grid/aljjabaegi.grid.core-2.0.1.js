/**
 * GEON LEE (http://aljjabaegi.tistory.com)
 * 2021/11/04 GEONLEE 2.0.0 core 2.0.0 version update
 * row 수정 삭제, file 관련 삭제
 *
 * 2022/03/29 GEONLEE 2.0.1 core 2.0.1 version update
 * AG_GRID에 접근하기 위한 전역 getProto closure 메소드 추가 (edit, multiSearch 기능 확장을 위한)
 * fixedCol 기능 관련 오류 수정
 *   - 체크박스, 행 클릭 이벤트 추가 시 오류 수정
 *   - colM 옵션에 hidden 컬럼이 있을 경우 fixedCol css Class 추가 오류 수정
 *   - browser size 또는 스크롤 시 fixedDiv 위치 보정 기능 추가
 * 체크박스 이벤트 개선
 *   - type: multi 일 때 전체체크박스 체크 시 전처리 함수 옵션이 있을 경우 전처리 함수결과에 따른 체크박스 체크
 * sort 이벤트 발생 시 multi chk all element 체크여부 초기화
 * 최적 for문으로 개선
 * nullish coalescing 적용
*/
"use strict";
(function(){
	class AG_GRID {
		constructor(options){
			const version = "2.0.1";
			const codeBy = "aljjabaegi.tistory.com";
			const ag = this;
			this.id = "grid";
			this.data = {
				paging: {
					pageIndex: 1,
					countPerPage: 10,
					totalPage: 1,
					firstPageOnPageList: 0,
					lastPageOnPageList: 0,
					recordCountPerPage: 10,
				},
				postData: {},
				sorting: [],
				search: {}
			};
			this.display = {
				page: true,
				rows: [10,20,30,40,50,100],
				height: 0,
				displayRows: 10,
				selection: {type:"none", pre : null, post : null},
				totalCount: true,
				scrollWidth: "7px",
				fixedColIdx: null,
				rowspan: []
			}
			this.func = {
				reorder: false,
				autoSearch: true,
				sort: false,
			}
			this.additionalFunc = {
				loadComplete: null,
				onClickRow: null
			}
			this.column = {
				colN: ["Sample Column1", "Sample Column2"],
				colM: [{id:"column1"},{id:"column2"}],
				group: [],
				datePicker: []
			}
			this.event = {
				page: {
					first: null,
					before: null,
					next: null,
					last: null
				},
				fixed: {
					origin: null,
					clone: null 
				},
				sort: null,
				onClickRow: null,
				checkbox: null
			}
			
			const defaultOptions = ["data", "display", "func", "column", "additionalFunc"];
			for(let [key, val] of Object.entries(options)){ //내가 보낸 option이 있으면,
				//옵션을 this에 달아줌
				//성공시 true, 실패시 false return
				const setOpt = function(key, val) {
					let result = false;
					for(const opt of defaultOptions){
						if(Object.keys(ag[opt]).includes(key) === true){
							result = true;
							ag[opt][key] = val;
							return result;
						}
					}
					return result;
				}
				//못달아준 option을 달아줌
				if(!setOpt(key, val)){
					this[key] = val;
				}
			}
			
			this.prefix = `ag_${this.id}`;
			if(typeof this.display.selection.type == "undefined") this.display.selection.type = "none";
			if(typeof options.searchType !== "undefined"){
				this.data.search.type = options.searchType;
			}
			if(typeof options.columnGroup !== "undefined"){
				this.column.group = options.columnGroup;
			}
			if(this.column.colM !== null){
				for(const [index, colm] of this.column.colM.entries()){
					if(colm.hidden !== true && colm.rowspan === true){
						const selection = this.display?.selection,
							  rowspan = this.display?.rowspan;
						selection.type === "none" ? rowspan.push(index) : rowspan.push(index+1);
					}
				}
			}
			this.setTable();
		}
		/**
		 * CSS 명 리턴 메소드  
		 * @method getCss
		 * @param{name} css object 키 (String)
		 * @return{className} 클래스명 (String)
		 */
		getCss(name){
			const css = {
				table: "ag_table",
				tableScroll: "ag_table_scroll",
				header: "ag_header",
				headerTbl: "ag_grid_header",
				headerTblTr: "ag_grid_header_tr",
				headerTblTh: "ag_header_th",
				headerDragDiv: "ag_dragDiv",
				headerTblDragTd: "ag_tableHeader",
				headerTblTdEnd: "ag_header_td_end",
				headerTblChk: "ag_header_chk",
				headerTblChkDiv: "ag_header_td_chk_div",
				headerSearch: "ag_header_search",
				searchField: "ag_search",
				btnArea: "ag_btn_wrap",
				basicBtn: "ag_btn basic",
				searchBtn: "ag_btn search",
				exlBtn: "ag_btn excel",
				uldBtn: "ag_btn upload",
				resetBtn: "ag_btn reset",
				printBtn: "ag_btn print",
				confirmBtn: "ag_btn confirm",
				chkBtn: "ag_btn check",
				msgBtn: "ag_btn msg",
				body: "ag_body",
				bodyTbl: "ag_body_table",
				bodyTblNoData: "nodata",
				bodyTblLoading : "loading",
				bodyTblTr: "ag_body_row",
				newLine: "ag_newLine",
				bodyTblChk: "ag_body_chk",
				bodyTblChkDiv: "ag_body_row_chk_div",
				footer: "ag_footer",
				footerTbl: "ag_footer_table",
				footerTblTr: "ag_footer_row",
				page: "ag_page_area",
				pageUl: "ag_paging",
				firstPage: "ag_first_page",
				beforePage: "ag_before_page",
				lastPage: "ag_last_page",
				nextPage: "ag_next_page",
				pageNumber: "ag_page_number",
				currentPage: "curr",
				recordCnt: "ag_rows",
				recordCntSel: "ag_rows_sel",
				totalCnt: "ag_total_cnt",
				cudBtnEvent: "ag_btnArea",
				ulFile: "ag_ul_file",
				selectedRow: "ag_sel_row",
				fixedCol: "ag_fixedCol",
				multiSearch: "ag_search multi",
				msSumrArea: "ag_smr",
			};
			return css[name];
		}
		/**
		 * 최초 그리드 세팅 메소드 - DOM생성, 최상위DIV size설정, resize 이벤트 등록
		 * @method setTable
		 * @param{} null
		 * @return{} null
		 */
		setTable(){
			const crtEle = this.createElement, div = document.getElementById(this.id),
				  scrollDiv = crtEle("div",{id: `${this.prefix}_scroll`, class: this.getCss("tableScroll")}),
				  tblDiv = crtEle("div",{id: this.prefix,class: this.getCss("table")}),
				  searchType = this.data.search.type;
			scrollDiv.appendChild(tblDiv)
			div.appendChild(scrollDiv);
			if(searchType === "single"){
				this.appendSingleSearchArea();
			}else if (searchType === "multi"){
				if(typeof this.appendMultiSearchArea === "undefined"){
					console.error("searchType:multi 의 경우 multiSearch Plugin이 필요합니다.");
					return false;
				}
				this.appendMultiSearchArea();
			}
			this.appendHeader();
			this.appendBody();
			this.appendPage();
			if(this.display.rows !== false) this.appendRecordCount();
			if(this.display.totalCount !== false) this.appendTotalCount();
			this.setTblWidth();
			window.addEventListener("resize", this.setTblWidth.bind(this));
			this.setTblHeight();
			if(this.func.autoSearch && typeof this.url !== "undefined") this.getData();
			if(this.edit){
				if(typeof this.setEdit !== "undefined"){
					this.setEdit();	
				}else{
					console.error("그리드의 에디트 기능을 사용하기 위해선 grid.plugin.edit 파일이 필요합니다.");
				}
			}
			if(typeof this.excel !== "undefined") this.appendExcelBtn();
		}
		/**
		 * 그리드 헤더 DOM 생성 및 이벤트 등록 메소드 - 헤더 컬럼생성(일반, 그룹), sorting, reorder event 
		 * @method appendHeader
		 * @param{} null
		 * @return{} null
		 */
		appendHeader(){
			const crtEle = this.createElement,
			  	  div = crtEle("div",{id: `${this.prefix}_header`,class: this.getCss("header")}),
			  	  tbl = crtEle("table",{id: `${this.prefix}_header_table`, class: this.getCss("headerTbl")}),
			  	  tbody = crtEle("tbody"),
			  	  colGroup = crtEle("colgroup"),
			  	  grpSize = this.column.group.length;
			tbl.appendChild(colGroup);
			let tr = null;
			if(grpSize > 0){
				const grp = this.column.group;
				let trGroupId = null;
				for(let i=0, n=grpSize; i<n; i++){
					trGroupId = `${this.prefix}_header_tr_group_${i}`;
					tr = crtEle("tr",{id: trGroupId, class: this.getCss("headerTblTr")});
					tbody.appendChild(tr);
				}
			}
			tr = crtEle("tr", {id: `${this.prefix}_header_tr`,class: this.getCss("headerTblTr")});
			tbody.appendChild(tr);
			tbl.appendChild(tbody);
			div.appendChild(tbl);
			document.getElementById(this.prefix).appendChild(div);
			if(grpSize > 0){
				this.appendColumnGroup();
			}else{
				this.appendColumn();
			}
			if(this.func.sort === true) this.setSortEvent();
			if(this.func.reorder) this.setReorderEvent();
		}
		/**
		 * 헤더 컬럼 생성 메소드 - colN으로 헤더 생성, 첫번째 컬럼에 체크박스 생성, 
		 * @method appendColumn
		 * @param{} null
		 * @return{} null
		 */
		appendColumn(){
			const ag = this, crtEle = this.createElement, css = this.getCss,
			      header = document.getElementById(`${this.prefix}_header`),
			      headerTable = document.getElementById(`${this.prefix}_header_table`),
			      headerTr = document.getElementById(`${this.prefix}_header_tr`),
			      sel = this.display.selection;
			let td = null, col = crtEle("col", {width: "40px"}), div = null;
			if(sel.type == "single") {
				td = crtEle("td",{scope: "col",class: css("headerTblChk")});
				headerTr.appendChild(td);
				headerTable.children[0].appendChild(col);
			}else if(sel.type == "multi"){
				td = crtEle("td",{scope: "col",class: css("headerTblChk")});
				div = crtEle("div",{class: css("headerTblChkDiv")});
				const input = crtEle("input", {type: "checkbox", id: `${this.prefix}_chkAll`});
				input.addEventListener("click", function(e){
					const tbody = document.querySelector(`#${ag.prefix}_body_table tbody`),
						  chkBoxes = tbody.querySelectorAll("input[type='checkbox']"),
						  preFunc = ag.display.selection.pre,
						  headerSize = document.querySelectorAll(`#${ag.prefix}_header_table tr`).length;
					for(let chkBox of chkBoxes){
						if(typeof preFunc === "function"){
							const tr = chkBox.closest("tr"),
							  	  data = ag.getRowData(tr.rowIndex - headerSize),
							  	  returnPre = preFunc.call(chkBox, data);
							if(returnPre){
								chkBox.checked = this.checked;
							}else{
								chkBox.checked = false;
							}
						}else{
							chkBox.checked = this.checked;
						}
					}
				});
				const label = crtEle("label", {for: `${this.prefix}_chkAll`});
				div.appendChild(input);
				div.appendChild(label);
				td.appendChild(div);
				headerTr.appendChild(td);
				headerTable.children[0].appendChild(col);
			}
			const colM = this.column.colM,
				  colN = this.column.colN,
				  tdOpt = {scope: "col"};
			let noWidthCnt = 0, widthSum = 0;
			let colOpt = {};
			for(let [i, col] of colM.entries()){
				if(!col.hidden){
					tdOpt.style = this.setStyle(col, "header");
					td = crtEle("td", tdOpt);
					div = crtEle("div", {name: `${this.prefix}_${col.id}`});
					div.innerHTML = colN[i] ?? "";
					td.appendChild(div);
					headerTr.appendChild(td);
					if(typeof col.size !== "undefined"){
						if(col.size.toString().indexOf("px") !== -1){
							colOpt.width = col.size;
						}else{
							colOpt.width = `${col.size}px`;
						}
						widthSum += parseInt(col.size);
					}else{
						noWidthCnt++;
					}
					col = crtEle("col",colOpt);
					headerTable.children[0].appendChild(col);
				}
				colOpt = {};
			}
			const scrollHeader = crtEle("col",{width: this.display.scrollWidth});
			headerTable.children[0].appendChild(scrollHeader);
			td = crtEle("td",{scope: "col", class: this.getCss("headerTblTdEnd")});
			headerTr.appendChild(td);
		}
		/**
		 * 헤더 컬럼그룹 생성 메소드 - colN, columnGroup으로 헤더 생성, 첫번째 컬럼에 체크박스 생성, 
		 * @method appendColumn
		 * @param{} null
		 * @return{} null
		 */
		appendColumnGroup(){
			const tr = document.getElementById(`${this.prefix}_header_tr`), /*header tbody tr*/
				  header = document.getElementById(`${this.prefix}_header`), /*header div*/
				  headerTbl = document.getElementById(`${this.prefix}_header_table`), /*header table*/
				  headerTbody = headerTbl.querySelector("tbody"),
				  headerColGroup = headerTbl.querySelector("colgroup"),
				  tableWidth = document.getElementById(this.id).clientWidth,
				  colM = this.column.colM, colN = this.column.colN, colGrp = this.column.group;
			let html = "", noWidthCnt = 0, widthSum = 0, attr = "";
			for(let i=0, n=colM.length; i<n; i++){
				if(!colM[i].hidden){
					//헤더 만들기
					html = "<td scope='col' class='"+this.getCss("headerTblTh")+
						   "' style='"+this.setStyle(colM[i], "header")+"'>"+
						   "<div name='"+this.prefix+"_"+colM[i].id+"'>"+colN[i]+"</div></td>";
					tr.insertAdjacentHTML("beforeend", html);
					for(let j=0, m=colGrp.length; j<m; j++){ /*colGroup 만큼 행 생성*/
						const grpTr = document.getElementById( `${this.prefix}_header_tr_group_${j}`);
						if(grpTr !== null){
							grpTr.insertAdjacentHTML("beforeend", html);
						}
					}
					attr = "";
					if(typeof colM[i].size !== "undefined"){
						if(colM[i].size.toString().includes("px")){
							attr = `width=${colM[i].size}`;
						}else if(colM[i].size.toString().includes("%")){
							attr = `width='${colM[i].size}px'`;	
						}else{
							attr = `width='${colM[i].size}px'`;
						}
						widthSum += parseInt(colM[i].size);
					}else{
						noWidthCnt++;
					}
					headerColGroup.insertAdjacentHTML("beforeend", `<col ${attr}/>`);
				}
			}
			tr.insertAdjacentHTML("beforeend", `<td scope='col' class='${this.getCss("headerTblTdEnd")}' hidden=true></td>`);
			/*colspan 처리*/
			for(let i=0, n=colGrp.length; i<n; i++){
				const grpTr = document.getElementById(`${this.prefix}_header_tr_group_${i}`);
				if(i == 0){
					html = "<td scope='col' rowspan="+(colGrp.length+1)+" class='"+this.getCss("headerTblTdEnd")+"'></td>";
					grpTr.insertAdjacentHTML("beforeend", html);
				}else{
					html = "<td scope='col' class='"+this.getCss("headerTblTdEnd")+"' hidden=true></td>";
					grpTr.insertAdjacentHTML("beforeend", html);
				}
				const tds = grpTr.children;
				
				const row = colGrp[i];
				for(const col of row){
					const td = tds[col.index];
					td.textContent = col.title;
					td.setAttribute("colspan", col.span);
					for(let z=col.index+1; z<col.index + col.span; z++){
						tds[z].setAttribute("hidden", true);
					}
				}
			}
			headerColGroup.insertAdjacentHTML("beforeend", `<col width='${this.display.scrollWidth}px'/>`);
			/*rowspan 처리*/
			let firstHeaderRowIdx = 0, colRowspan = 0;
			for(let i=0, n=colM.length; i<n; i++){
				if(!colM[i].hidden){
					const headerNames = document.querySelectorAll(`div[name=${this.prefix}_${colM[i].id}]`);
					firstHeaderRowIdx = 0;
					colRowspan = 0;
					for(let j=0, m=headerNames.length; j<m; j++){
						const div = headerNames[j];
						if(!div.parentNode.getAttribute("hidden")){
							if(colRowspan == 0) firstHeaderRowIdx = j;
							colRowspan += 1;
							if(j > 0 && colRowspan > 1) div.parentNode.setAttribute("hidden", true);
						}
					}
					if(colRowspan > 1){
						headerNames[firstHeaderRowIdx].parentNode.setAttribute("rowspan", colRowspan);
					}
				}
			}
			html = "";
			/*체크박스 처리*/
			const sel = this.display.selection;
			if(sel.type !== "none"){
				html = "<td scope='col' class='"+this.getCss("headerTblChk")+"' rowspan="+(colGrp.length+1)+">";
				if(sel.type == "single"){
					html += "</td>";
				}else if(sel.type === "multi"){
					html += "<div class"+this.getCss("headerTblChkDiv")+">";
					html += "<input type='checkbox' id='"+this.prefix+"_chkAll'>" +
							"<label for='"+this.prefix+"_chkAll'></div></td>";
				}
				headerTbody.children[0].insertAdjacentHTML("afterbegin", html);
				headerColGroup.insertAdjacentHTML("afterbegin", "<col width='40px'/>");
				for(let i=1, n=colGrp.length+1; i<n; i++){
					html = "<td scope='col' class='"+this.getCss("headerTblChk")+"' hidden=true></td>";
					headerTbody.children[i].insertAdjacentHTML("afterbegin", html);
				}
				if(sel.type === "multi"){
					const input = document.getElementById(`${this.prefix}_chkAll`),
					  ag = this;
					input.addEventListener("click", function(e){
						const checked = this.checked;
						const chkDivs = document.getElementsByName(`${ag.prefix}_row_chk_div`);
						for(let chkDiv of chkDivs){
							chkDiv.querySelector("input[type='checkbox']").checked = checked;
						}
					});
				}
			}
		}
		/**
		 * 바디 DOM 생성 메소드 
		 * @method appendColumn
		 * @param{} null
		 * @return{} null
		 */
		appendBody(){
			const crtEle = this.createElement,
				  div = crtEle("div",{id: `${this.prefix}_body`, class: `${this.getCss("body")}`}),
				  table = crtEle("table", {summary: `${this.title} 리스트`, 
					  					   id: `${this.prefix}_body_table`,
					  					   class: this.getCss("bodyTbl")}),
				  caption = crtEle("caption", {class: "hidden", hidden: true}),
				  headerColGroup = document.getElementById(`${this.prefix}_header_table`).children[0];
			div.classList.add(`${this.getCss("bodyTblNoData")}`);
			caption.textContent = `${this.title} 리스트`;
			document.getElementById(this.prefix).appendChild(div);
			
			/*접근성을 위해 body의 thead에 header의 tbody를 복사해서 넣는다*/
			const bodyColGroup = headerColGroup.cloneNode(true),
				  thead = crtEle("thead"), tbody = crtEle("tbody"), tfoot = crtEle("tfoot"),
				  headerTbl = document.getElementById(`${this.prefix}_header_table`),
				  headerTbody = headerTbl.getElementsByTagName("tbody")[0],
				  headerTrChildren = headerTbody.children;
			this.removeElement(bodyColGroup.lastElementChild);
			
			for(const headerTr of headerTrChildren){
				thead.appendChild(headerTr.cloneNode(true));
			}
			
			table.appendChild(bodyColGroup);
			table.appendChild(thead);
			table.appendChild(tbody);
			table.appendChild(tfoot);
			div.appendChild(caption);
			div.appendChild(table);
			this.appendBodyHeader();
		}
		/**
		 * [접근성] 바디에 thead와 헤더의 tbody를 동기화해주는 메소드
		 * @method appendBodyHeader
		 * @param{} null
		 * @return{} null
		 */
		appendBodyHeader(){
			const gridDiv = document.getElementById(this.prefix);
			const bodyTbl = gridDiv.querySelector(`#${this.prefix}_body_table`);
			const bodyThead = bodyTbl.querySelector("thead");
			if(bodyThead !== null) bodyTbl.removeChild(bodyThead);
			const headerTbl = gridDiv.querySelector(`#${this.prefix}_header_table`);
			const headerTbody = headerTbl.querySelector("tbody");
			const headerTrs = headerTbody.children; 
			const newThead = this.createElement("thead");
			for(let tr of headerTrs){
				newThead.appendChild(tr.cloneNode(true));
			}
			bodyTbl.insertBefore(newThead, bodyTbl.childNodes[0]);
			
		}
		/**
		 * 그리드 바디 행 추가 메소드 - formatter, 첫번째 컬럼에 체크박스 생성, 행 체크박스 이벤트, 행 클릭 이벤트, 로드컴플릿 이벤트
		 * @method appendRows
		 * @param{} null
		 * @return{} null
		 */
		appendRows(data, idx, callback){ //특정 행 아래 넣어줄때 idx 넘겨줌
			const ag = this, tbody = this.getTbody(), size = data.length,
				  crtEle = this.createElement, sel = this.display.selection,
				  css = this.getCss, colM = this.column.colM,
				  bodyClass = document.getElementById(`${this.prefix}_body`).classList;
			bodyClass.remove(`${this.getCss("bodyTblNoData")}`)
			let html = "";
			for(let [i, d] of data.entries()){ //entries
				html += "<tr class='"+css("bodyTblTr")+" "+((typeof idx !== "undefined") ? css("newLine") : "")
					  + "' id='"+this.prefix+"_row_"+i+"'>";
				if(sel.type !== "none"){
					html += "<td scope='row' class='"+css("bodyTblChk")+"'>" +
					"<div class='"+css("bodyTblChkDiv")+"' name='"+this.prefix+"_row_chk_div'>" +
					"<input type='checkbox' id='"+this.prefix+"_row_chk_"+i+"'>" +
							"<label for='"+this.prefix+"_row_chk_"+i+"'></div></td>";
				}
				
				let originVal = "";
				for(let colm of colM){
					originVal = d[colm.id] ?? ""; 
					let value = "";
					if(colm.formatter){
						value = colm.formatter.call(colm, originVal, d,
								((typeof idx !== "undefined") ? true : false));
					}else{
						value = originVal;
					}
					html += "<td scope='row' title='"+originVal+"' style='"+
						this.setStyle(colm, "body")+"'>"+(value ?? "")+"</td>";
				}
				html += "</tr>";
			}
			idx = (idx < 0) ? 0 : idx;
			if(typeof idx == "undefined"){
				tbody.insertAdjacentHTML("beforeend", html);
			}else{
				const trSize = tbody.children.length;
				if(trSize == 0){
					tbody.insertAdjacentHTML("beforeend", html);
				}else if(idx < trSize){
					tbody.children[idx-1].insertAdjacentHTML("afterend", html);
				}else{
					tbody.insertAdjacentHTML("beforeend", html);
				}
			}
			if(this.display.selection.type !== "none") this.setRowChkboxEvent(idx, data.length);
			if(typeof this.additionalFunc?.onClickRow === "function") this.setOnClickRowEvent(idx, data.length);
			if(typeof this.additionalFunc?.loadComplete === "function") this.additionalFunc.loadComplete.call(this, data);
			if(this.display?.fixedColIdx !== null && typeof idx == "undefined") this.appendfixedCol();
			if(this.display.rowspan.length > 0) this.setRowSpan(); // rowspan이 true인 경우
			if(typeof callback == "function") callback();
			bodyClass.remove(`${this.getCss("bodyTblLoading")}`);
		}
		
		/**
		 * 열 병합 메소드 - rowSpan=true 옵션을 주면 해당 열에서 데이터가 같은 값 끼리 열 병합 한다.
		 * @method setRowSpan
		 * @param{} null
		 * @return{} null
		 */
		setRowSpan(){
			// 열끼리 data를 비교하여 같으면 span 설정해줌
			// delete해야할 element에 delete class를 달아줌
			// 열 병합할 element의 리스트를 반환
			const setTarget = function(colIdx, trs) {
				let preEle = null,
			 		spanCount = 1;
				const targetList = [];
					for(const tr of trs){
						const td = tr.childNodes[colIdx] ?? null;
						if(td !== null){
							//td가 chkbox면 건너뛰기
							if(td.classList.contains("ag_body_chk")){ // ok?
								continue;
							}
							if(preEle?.textContent === td.textContent){
								spanCount++;
								td.setAttribute("class", "row_span_delete");
							} else {
								if(preEle !== null){
									if(spanCount > 1) targetList.push({node:preEle, spanCount});
								}
								preEle = td;
								spanCount = 1;
							}
						}
					}
					//마지막 td는 비교할 다음 td가 없기 때문에 spanList에 push되지 않는 현상
					// => 마지막 td를 push해줌
					if(spanCount > 1) targetList.push({node:preEle, spanCount});
				return targetList;
			}
			
			const trs = document.querySelector(`#${this.prefix}_body_table tbody`).childNodes,
			  colLength = document.querySelector(`#${this.prefix}_header_tr`).childNodes.length - 1,
	  	  	  ftrs = document.querySelector(`#${this.prefix}_body_fixed tbody`)?.childNodes,
	  	  	  fcolLength = document.querySelector(`#${this.prefix}_header_tr_fixed`)?.childNodes.length;
			let targetList = [];

			/*targetList를 가져옴*/
			for(const index of this.display.rowspan){
				targetList = targetList.concat(setTarget(index, trs));
				// 틀고정인 경우
				if(this.display.fixedColIdx){
					targetList = targetList.concat(setTarget(index, ftrs));
				}
			}
			
			/*열 병합*/
			//rowspan attribute 달아줌
			for(const obj of targetList){
				obj.node.setAttribute("rowSpan", obj.spanCount);
			}
			
			//element 삭제
			const eleList = document.querySelectorAll(".row_span_delete");
			for(const ele of eleList){
				ele.style.display = "none";
			}
		}
		/**
		 * 단건 조회부 생성 메소드 - 조회부 관련 이벤트 등록, setCustomSearch 호출
		 * @method appendSingleSearchArea
		 * @param{} null
		 * @return{} null
		 */
		appendSingleSearchArea(){
			const ag = this, crtEle = this.createElement, css = this.getCss, colM = this.column.colM,
				  colN = this.column.colN, customTpArray = ["date", "datetime", "combo", "number"], 
				  searchSel = crtEle("select", {id: `${this.prefix}_single_search_col`}),
				  fieldset = crtEle("fieldset", {id:`${this.prefix}_ms_fset`, class: css("searchField")});
			let customType = false, searchable = true, type = null;
			for(let [i, col] of colM.entries()){
				searchable = true;
				if(col.hidden || col.searchable === false){
					searchable = false;
				}
				if(searchable){
					type = (typeof col.type == "undefined") ? "" : col.type;
					const option = crtEle("option", {value: col.id, idx: i, type: type});
					option.textContent = colN[i];
					searchSel.appendChild(option);
				}
				if(customType === false){
					if(customTpArray.indexOf(col.type) !== -1) customType = true;	
				}
			}
			const input = crtEle("input", {type: "text", id: `${this.prefix}_single_search_value`,
						  autocomplete: 'off', placeholder: '검색어를입력하세요'}),
				  div = crtEle("div", {class: this.getCss("btnArea")}),
				  btn = crtEle("button", {type: "button", id: `${this.prefix}_single_search_btn`}),
				  parentDiv = document.getElementById(this.id);
			btn.textContent = "검색";
			btn.classList.add("ag_btn", "search");
			div.appendChild(btn);
			fieldset.appendChild(searchSel);
			fieldset.appendChild(input);
			fieldset.appendChild(div);
			parentDiv.insertBefore(fieldset, parentDiv.childNodes[0]);
			input.addEventListener("click", function(e){
				this.value = "";
				e.preventDefault();
			});
			input.addEventListener("keyup", function(e){
				if(e.keyCode == 13){
					ag.reload("search");
				}
				e.preventDefault();
			});
			searchSel.addEventListener("change", function(e){
				this.nextElementSibling.focus();
				e.preventDefault();
			});
			btn.addEventListener("click", function(e){
				ag.reload("search");
			});
			if(customType) this.setCustomSingleSearch();
		}
		/**
		 * 페이지 DOM 영역 생성 메소드
		 * @method appendPage
		 * @param{} null
		 * @return{} null
		 */
		appendPage(){
			const crtEle = this.createElement, ag = this,
				  div = document.getElementById(this.id),
				  data = this.data.paging,
				  page = crtEle("div", {id: `${this.prefix}_paging_div`, class: this.getCss("page")}),
				  ul = crtEle("ul", {id: `${this.prefix}_paging`, class: this.getCss("pageUl")}),
				  defaultOpt = {
				      firstPage: {name: "처음", idx: 1},
				      beforePage: {name: "이전", idx: data.pageIndex-1},
				      pageNumber: {name: "1", idx: 1},
				      nextPage: {name: "다음", idx: data.pageIndex+1},
				      lastPage: {name: "마지막", idx: data.totalPage}
				  },
				  pageEvent = this.event.page
			if(this.display.page !== false){
				for(let [key, value] of Object.entries(defaultOpt)){
					const li = crtEle("li", {class: this.getCss(key)});
					if(key === "pageNumber") li.classList.add(this.getCss("currentPage"));
					const a = crtEle("a", {href: "#"});
					a.textContent = value.name;
					li.appendChild(a);
					const pageFunc = this.movePage.bind(this, value.idx);
					li.addEventListener("click", pageFunc);
					ul.appendChild(li);
					if(key !== "pageNumber"){
						pageEvent[key.split("Page")[0]] = pageFunc;
					}
				}
				page.appendChild(ul);
				div.appendChild(page);
			} else{
				div.appendChild(page);
			}
		}
		/**
		 * 전체 행 개수 DOM 영역 생성 메소드
		 * @method appendTotalCount
		 * @param{} null
		 * @return{} null
		 */
		appendTotalCount(){
			const crtEle = this.createElement, css = this.getCss,
				  div = crtEle("div", {class: css("totalCnt")}),
				  spanTitle = crtEle("span"), spanContent = crtEle("span", {id: `${this.prefix}_total_cnt`}),
				  parentDiv = document.getElementById(this.id);
			spanTitle.textContent = "전체 : ";
			spanContent.textContent = "0";
		    div.appendChild(spanTitle);
		    div.appendChild(spanContent);
		    document.getElementById(`${this.prefix}_paging_div`).appendChild(div);
		}
		/**
		 * 엑셀 버튼 및 기능 추가 메소드  
		 * @method appendExcelBtn
		 * @param{} null
		 * @return{} null
		 */
		appendExcelBtn(){
			const ag = this, crtEle = this.createElement, excel = this.excel, totalCnt = this.data.paging.totalCount;
			let fieldset = document.getElementById(`${this.prefix}_ms_fset`);
			if(fieldset === null){
				fieldset = crtEle("fieldset", {id: `${this.prefix}_ms_fset`, class: this.getCss("multiSearch")});
				const sumDiv = crtEle("div", {class: this.getCss("msSumrArea")}),
					  btnDiv = crtEle("div", {class: this.getCss("btnArea")}),
					  parentDiv = document.getElementById(this.id);
				sumDiv.appendChild(btnDiv);
				fieldset.appendChild(sumDiv);
				parentDiv.insertBefore(fieldset, parentDiv.childNodes[0]);
			}
			const btnArea = fieldset.querySelector(".ag_btn_wrap"),
				  excelBtn = crtEle("button", {id: `${this.prefix}_excelBtn`, class: this.getCss("exlBtn")}),
				  span = crtEle("span", {txt: "엑셀"});
			excelBtn.appendChild(span);
			btnArea.appendChild(excelBtn);
			const func = function(){
				if(typeof excel.url === "undefined" || excel.url == ""){
					alert("엑셀 다운로드를 위한 URL 옵션이 존재하지 않습니다. excel : {url ?}");
					return false;
				}
				let msg = "엑셀파일로 다운로드 하시겠습니까?";
				if(totalCnt > 50000){
					msg = "50,000개 이상 데이터 추출 시 다소 시간이 소요될 수 있습니다.\n엑셀 파일로 다운로드 하시겠습니까?";
				}
				if(confirm(msg)){
					if(typeof excel.pre !== "undefined") excel.pre();
					ag.ajax(excel.url, {}, function(returnData){}, "excel");
				}
			}
			excelBtn.addEventListener("click", func.bind(excelBtn));
		}
		/**
		 * 그리드 열 틀고정을 위한 DOM 및 기능 추가 이벤트  
		 * @method appendfixedCol
		 * @param{} null
		 * @return{} null
		 */
		appendfixedCol(){
			/*body td는 hidden 옵션이 true인 col도 display:none 으로 추가되어있다. => 클릭한 행 데이터 리턴 시 hidden 컬럼 데이터도 리턴
			 * header td는 추가되지 않음. 그래서 body와 header의 index가 다름
			 * colm 객체에 hidden이 true 일 경우나 size가 픽스된 경우, checkbox옵션이 있을 경우도 고려를 해야됨.
			 * 체크박스는 제외하고 clone 생성 방식으로 변경
			 * */
			
			const ag = this, fixedDiv = document.getElementById(`${this.prefix}_fixed`),
				  fixedIdx = this.display.fixedColIdx, sel = this.display?.selection,
				  chk = (["single", "multi"].includes(sel.type)) ? 1 : 0,
				  originGrid = document.getElementById(this.prefix),
				  cloneGrid = originGrid.cloneNode(true), colM = this.column.colM,
				  scrollDiv = document.getElementById(`${this.prefix}_scroll`),
				  rectLeft = scrollDiv.getBoundingClientRect().left;
			
			
			
			const chgId = function(element){
				const id = element.getAttribute("id");
				if(id !== null){
					element.setAttribute("id", `${id}_fixed`);
				}
				if(element.children.length > 0){
					for(let child of element.children){
						chgId(child);
					}
				}
			}
			let bfIdx = fixedIdx+chk, hfIdx = fixedIdx+chk, chkIdx = 0; /*body와 header 갯수 다름*/
			/*hidden 옵션을 체크하여 bodyFixedIndex 설정*/
			for(let i=chk, n=colM.length; i<n; i++){
				if(colM[i]?.hidden === true){
					bfIdx++;
				}else{
					chkIdx++;
				}
				if(fixedIdx + 1 === chkIdx) break;
			}
			
			// 헤더의 colspan이 fixedColIdx를 넘으면, colspan을 fixedColIdx에 맞게 줄여줘야함
			const trs = document.querySelectorAll(`#${this.prefix}_header tbody tr`);
			for(const tr of trs){
				let colspanSum = 0;
				const tds = tr.children;
				for(let i=0; i<hfIdx+1; i++){
					const td = tds[i]
					if(!td.hidden){ //hidden인 td는 제외
						//colspan의 합이 fixedIndex보다 크면 fixed옵션 무시
						const colspan = td.getAttribute("colspan") ?? 1; 
						colspanSum += Number(colspan);
						if(colspanSum > hfIdx+1){
							console.error("fixedColIndx값이 잘못 설정되었습니다!");
							this.display.fixedColIdx = null;
							return false;
						}
					}
				}
			}
			
			const cloneColGroup = cloneGrid.querySelectorAll("colgroup");
			/*colGroup 개수를 fixedColIndex로 맞춘다*/
			for(let cg of cloneColGroup){
				const cols = cg.childNodes;
				for(let i=cols.length-1, n=fixedIdx + chk; i>n; i--){
					cg.removeChild(cols[i]);
				}
			}
			chgId(cloneGrid);
			const headerTr = document.querySelector(`#${this.prefix}_header_tr`),
				  fixedHeaderTr = cloneGrid.querySelector(`#${this.prefix}_header_tr_fixed`),
				  firstTr = document.querySelector(`#${this.prefix}_header tbody`).children[0],
				  firstTd = firstTr.childNodes[0];
			let divWidth = 0;
			for(let i=0, n=hfIdx+1; i<n; i++){
				/*fixed 그리드의 width설정하기*/
				const td = headerTr.childNodes[i];
				if(td.classList.contains("ag_header_chk") && td.getAttribute("hidden") == "true"){
					divWidth += firstTd.offsetWidth;
				}
				divWidth += td.offsetWidth;
				/*header sort evnet 기능추가*/
				if(this.func.sort === true){ 
					if(i >= chk){
						const fixedTd = fixedHeaderTr.childNodes[i];
						fixedTd.addEventListener("click", this.event.sort);
					}
				}
			}
			/*fixed col을 표출하기 위한 위치값 top, left를 구한다.*/
			cloneGrid.style = "";
			cloneGrid.style.position = "absolute";
			cloneGrid.style.top = "0px";
			cloneGrid.style.left = "0px";
			cloneGrid.style.width = divWidth + "px";
			cloneGrid.querySelector(`#${this.prefix}_body_fixed`).classList.remove("loading");
			/*fixedColIdx 만 남기도 나머지 요소는 삭제한다.*/
			["tbody", "thead"].forEach(function(selector){
				const doms = cloneGrid.querySelectorAll(selector);
				for(let dom of doms){
					const p = dom.parentNode.id, trs = dom.childNodes,
					  	  div = (p.includes("header")) ? "header" : "body";
					for(let tr of trs){
						const tds = tr.childNodes;
						let endIdx = 0;
						if(div === "header"){
							endIdx = hfIdx;
						}else if(div === "body"){
							endIdx = bfIdx;
						}
						for(let i=tds.length-1, n=endIdx; i>n; i--){
							tr.removeChild(tds[i]);
						}
						if(tr.id.includes("group")){
							let childSize = tr.childNodes.length;
							while(childSize--){
								const groupTd = tr.childNodes[childSize];
								if(groupTd.getAttribute("hidden") === null){
									groupTd.classList.add(ag.getCss("fixedCol"));
								}
							}
						}else{
							tr.lastChild.classList.add(ag.getCss("fixedCol"));
						}
					}
				}
			});
			cloneGrid.querySelector(`#${this.prefix}_body_fixed`).classList.add("fixed");
			
			/*없을 경우는 grid추가 // 있을 경우는 행만 복사해서 추가, 체크박스, 행클릭 이벤트가 있을 경우 추가*/
			const onClickRow = this.event.onClickRow, 
			  	  chkboxClick = this.event.checkbox;
			const setClickRowEvent = function(tr){
				const tds = tr.children;
				for(let td of tds){
					if(!td.classList.contains("ag_body_chk")){
						td.addEventListener("click", onClickRow.bind(td));
					}
				}
			}
			const setChkEvent = function(tr){
				const tds = tr.children;
				for(let td of tds){
					if(!td.classList.contains("ag_body_chk") && chkboxClick !== null){
						const checkBox = tr.querySelector("input[type=checkbox]");
						td.addEventListener("click", chkboxClick.bind(checkBox));
					}
				}
			}
			if(fixedDiv == null){
				scrollDiv.appendChild(cloneGrid);
				/*fixed col height 동기화*/
				const htr = cloneGrid.querySelector(`#${this.prefix}_header_fixed tr`),
					  ohtr = scrollDiv.querySelector(`#${this.prefix}_header_tr`);
				htr.style.height = `${ohtr.clientHeight}px}`;
				const trs = cloneGrid.querySelectorAll(`#${this.prefix}_body_table_fixed tr`);
				for(let tr of trs){
					if(onClickRow !== null) setClickRowEvent(tr);
					if(chkboxClick !== null) setChkEvent(tr);
				}
			}else{
				const fixedTbody = document.querySelector(`#${this.prefix}_body_table_fixed tbody`),
					  cloneTbody = cloneGrid.querySelector(`#${this.prefix}_body_table_fixed tbody`);
				if(fixedTbody !== null) fixedTbody.innerHTML = "";
				cloneTbody.childNodes.forEach(function(tr){
					const fixedTr = tr.cloneNode(true);
					if(onClickRow !== null) setClickRowEvent(fixedTr);
					if(chkboxClick !== null) setChkEvent(fixedTr);
					fixedTbody.appendChild(fixedTr);
				});
			}
			/*multi selection event 등록*/
			if(sel.type == "multi"){
				const label = cloneGrid.querySelector("label");
				label.setAttribute("for", `${this.prefix}_chkAll_fixed`);
				const input = cloneGrid.querySelector(`#${this.prefix}_chkAll_fixed`),
					  oInput = document.querySelector(`#${this.prefix}_chkAll`);
				input.addEventListener("click", function(e){
					let tbody = null;
					if(fixedIdx !== null){
						tbody = document.querySelector(`#${ag.prefix}_body_table_fixed tbody`);
					}else{
						tbody = document.querySelector(`#${ag.prefix}_body_table tbody`);
					}
					const chkBoxes = tbody.querySelectorAll("input[type='checkbox']"),
					  	  preFunc = ag.display.selection.pre,
					  	  headerSize = document.querySelectorAll(`#${ag.prefix}_header_table tr`).length;
					for(let chkBox of chkBoxes){
						if(typeof preFunc === "function"){
							const tr = chkBox.closest("tr"),
							  	  data = ag.getRowData(tr.rowIndex - headerSize),
							  	  returnPre = preFunc.call(chkBox, data);
							if(returnPre){
								chkBox.checked = this.checked;
							}else{
								chkBox.checked = false;
							}
						}else{
							chkBox.checked = this.checked;
						}
					}
					if(fixedIdx !== null){
						oInput.checked = this.checked;
						const cbs = document.querySelectorAll(`#${ag.prefix}_body_table tbody input[type='checkbox']`);
						for(let [index, cb] of cbs.entries()){
							cb.checked = chkBoxes[index].checked;
						}
					}
				});
			}
			/*가로 스크롤 기능*/
			const oBody = originGrid.querySelector(`#${ag.prefix}_body`),
			  	  cBody = cloneGrid.querySelector(`#${ag.prefix}_body_fixed`);
			scrollDiv.addEventListener("scroll", function(){ /*가로스크롤 체크*/
				cloneGrid.style.position = "fixed";
				cloneGrid.style.top = `${(scrollDiv.offsetTop - window.pageYOffset)}px`;
				cloneGrid.style.left = `${rectLeft}px`;
			});
			document.addEventListener("scroll", function(){
				cloneGrid.style.position = "absolute";
				cloneGrid.style.top = "0px";
				cloneGrid.style.left = `${(scrollDiv.scrollLeft)}px`;
			});
			/*동시 스크롤 기능*/
			const fEvt = this.event.fixed;
			oBody.addEventListener("scroll", function(){ /*세로 스크롤 체크*/
				if(fEvt.origin && fEvt.origin.id != this.id) return false;
				cBody.scrollTop = this.scrollTop;
				fEvt.origin = this;
				if(fEvt.clone) clearTimeout(fEvt.clone);
				fEvt.clone = setTimeout(function(){
					fEvt.origin = null;
					fEvt.clone = null;
				}, 500);
			});
			cBody.addEventListener("scroll", function(){ /*세로 스크롤 체크*/
				if(fEvt.origin && fEvt.origin.id != this.id) return false;
				oBody.scrollTop = this.scrollTop;
				fEvt.origin = this;
				if(fEvt.clone) clearTimeout(fEvt.clone);
				fEvt.clone = setTimeout(function(){
					fEvt.origin = null;
					fEvt.clone = null;
				}, 500);
			});
		}
		/**
		 * 표출 행 개수 변경 영역 생성 메소드 - default = [10,20,30,40,50,100]
		 * @method appendRecordCount
		 * @param{} null
		 * @return{} null
		 */
		appendRecordCount(){
			const ag = this, crtEle = this.createElement, rows = this.display.rows,
				  sel = this.display.selection, pageData = this.data.paging,
				  fixedCol = this.display.fixedColIdx;
			if(Array.isArray(rows)){
				const select = crtEle("select", {id: `${this.prefix}_record_cnt`,
							   class: this.getCss("recordCnt")});
				for(let val of rows){
					if(Number.isInteger(val)){
						const option = crtEle("option",{value: val});
						option.textContent = val;
						select.appendChild(option);	
					}
				}
				document.getElementById(`${this.prefix}_paging_div`).appendChild(select);
				this.data.paging.recordCountPerPage = select.options[0].value;
				select.addEventListener("change", function(){
					if(sel.type == "multi") {
						document.getElementById(`${ag.prefix}_chkAll`).checked = false;
						if(fixedCol !== null){
							document.getElementById(`${ag.prefix}_chkAll_fixed`).checked = false;	
						}
					}
					pageData.recordCountPerPage = this.options[this.selectedIndex].value*1;
					ag.reload("search");
				});
			}
		}
		/**
		 * 페이지 이동 메소드 - reload 호출
		 * @method movePage
		 * @param{pageIdx} 페이지인덱스 (int)
		 * @return{} null
		 */
		movePage(pageIdx){
			const sel = this.display.selection;
			const data = this.data.paging;
			if(sel.type == "multi"){
				document.getElementById(`${this.prefix}_chkAll`).checked = false;
				if(this.display.fixedColIdx !== null){
					document.getElementById(`${this.prefix}_chkAll_fixed`).checked = false;	
				}
			}
			if(pageIdx > 0 && pageIdx <= data.totalPage){
				data.pageIndex = pageIdx;
				this.reload("page");
			}
		}
		/**
		 * 데이터 개수에 따른 페이지 영역 DOM 생성 메소드
		 * @method updatePage
		 * @param{} null
		 * @return{} null
		 */
		updatePage(){
			const ag = this;
			const pageUl = document.getElementById(`${this.prefix}_paging`),
			      lis = pageUl.querySelectorAll(`.${this.getCss("pageNumber")}`),
			      pageData = this.data.paging,
			      firstPageIdx = pageData.firstPageOnPageList,
			      lastPageIdx = pageData.lastPageOnPageList,
			      crtEle = this.createElement, pageEvent = this.event.page,
			      basePageBtn = [{classNm: "ag_before_page", idx: this.data.paging.pageIndex-1}, 
			    	  {classNm: "ag_next_page", idx: this.data.paging.pageIndex+1},
			    	  {classNm: "ag_last_page", idx: this.data.paging.totalPage}];
			for(let li of lis){
				if(li.classList.contains("ag_page_number")){
					pageUl.removeChild(li);
				}
			}
			for(let obj of basePageBtn){
				pageUl.getElementsByClassName(obj.classNm)[0].removeEventListener("click",
						pageEvent[obj.classNm.split("_")[1]]);
				pageEvent[obj.classNm.split("_")[1]] = null;
				const pageFunc = this.movePage.bind(this, obj.idx);
				pageUl.getElementsByClassName(obj.classNm)[0].addEventListener("click", pageFunc);
				pageEvent[obj.classNm.split("_")[1]] = pageFunc;
			}
			let addIdx = 2;
			for(let i=firstPageIdx; i<=lastPageIdx; i++){
				const li = crtEle("li", {class: ag.getCss("pageNumber")});
				const a = crtEle("a", {href: "#"});
				a.textContent = i;
				li.appendChild(a);
				if(pageData.pageIndex == i) li.classList.add("curr");
				li.addEventListener("click", ag.movePage.bind(this, i));
				pageUl.insertBefore(li, pageUl.childNodes[addIdx]);
				addIdx++;
			}
		}
		/**
		 * 설정값에 따른 그리드 width 세팅 메소드 - 브라우저 resize 시 동작
		 * @method 1Width
		 * @param{} null
		 * @return{} null
		 */
		setTblWidth(){
			const headerColGrp = document.querySelector(`#${this.prefix}_header_table colgroup`),
				  colGrp = headerColGrp.children,
				  size = colGrp.length,
				  div = document.getElementById(this.id),
				  scrollDiv = document.getElementById(this.prefix);
			let sum = 0;
			for(let col of colGrp){
				const width = col.getAttribute("width");
				if(width !== null){
					sum += parseInt(width.replace(/[^0-9]/g, ""));
				}
			}
			if(div.clientWidth > 0 && div.clientWidth < sum){
				scrollDiv.style.width = sum+"px";
			}
			if(this.display.fixedColIdx !== null){
				const fixedDiv = document.getElementById(`${this.prefix}_fixed`);
				if(fixedDiv !== null){
					let fIdx = this.display.fixedColIdx, width = 0;
					const gridDiv = document.getElementById(this.prefix),
						  fixedTr = fixedDiv.querySelector(`#${this.prefix}_header_tr_fixed`),
						  headerTr = gridDiv.querySelector(`#${this.prefix}_header_tr`),
						  fixedColSize = fixedTr.children.length;
					/*스크롤롤 또는 browser resize에 따른 fixedDiv 위치 보정, 좌측스크롤 시 fixed로 변경됨/다른경우 absolute*/
					if(fixedDiv.style.position === "fixed"){
						fixedDiv.style.top = document.getElementById(`${this.prefix}_scroll`).offsetTop+"px";
					}
					for(let i=0, n=fixedColSize; i<n; i++){
						width += headerTr.children[i].clientWidth + 1; /*1은 border*/
					}
					document.getElementById(this.prefix+"_fixed").style.width = width+"px";
				}
			}
		}
		/**
		 * 설정값에 따른 그리드 height 세팅 메소드 - height옵션 (calc, px, number로 설정가능)
		 * @method setTblHeight
		 * @param{} null
		 * @return{} null
		 */
		setTblHeight(){
			const tblBody = document.getElementById(`${this.prefix}_body`),
				  trs = tblBody.querySelector("tbody").children,
				  height = this.display.height, colGroup = this.column.group,
				  displayRows = this.display.displayRows;
			let setHeight = 0;
			if(height !== 0){
				if(typeof height == "string"){
					if(height.indexOf("calc") !== -1){
						setHeight = height;
					}else if(height.indexOf("px") !== -1){
						setHeight = parseInt(height.replace(/[^0-9]/g, ""));
					}
				}else if(typeof height == "number"){
					setHeight = height;
				}
			}else{
				/*상하 패딩 10 폰트size 16.5*/
				setHeight = ((trs[0] ? trs[0].offsetHeight : 36.5) * displayRows) + displayRows;
			}
			if(typeof setHeight !== "string") setHeight = setHeight+"px";
			tblBody.style.height = setHeight;
		}
		/**
		 * datepicker 설정 메소드
		 * @method setDatePicker
		 * @param{id, type, rangeYn, dm} 추가할 요소 id(String), type(String['date', 'datetime'), 
		 * 		 rangeYn(boolean), 표출할 달(int[defailt 1])}
		 * @return{} null
		 */
		setDatePicker(id, type, rangeYn, dm){
			const ag = this, multiData = this.data.multi;
			const ADP = (typeof window.ADP !== "undefined") ? window.ADP : null;
			if(!ADP){
				alert("colM의 타입이 date/datetime일 경우 datepicker.js 파일을 import 해야합니다.");
				return false;
			}
			const searchType = this.data.search.type;
			let callback = null;
			if(searchType == "multi"){
				callback = function(id){
					const input = document.getElementById(id), value = input.value,
						  key = id.split(`${ag.prefix}_ms_`)[1],
						  mData = ag.data.search.multi;
					if(value !== ""){
						if(typeof mData[key] === "undefined"){
			            	mData[key] = [value];
		                	ag.appendMultiCondition(input, key, value);
			  			}else{
			  				if(mData[key].indexOf(value) == -1){
			  					mData[key].push(value);
			  					ag.appendMultiCondition(input, key, value);
			  				}
			  			}	
					}
					input.value = "";
				}.bind(this, id);
			}
			const calOption = {
				id: id,
		        allowPast: true,
		        months: dm,
		        rangePicker: rangeYn,
		        type: type,
		        callback: (callback !== null) ? callback : null
			};
			this.column.datePicker.push(new ADP(calOption));
		}
		/**
		 * combobox 설정 메소드
		 * @method setCombobox
		 * @param{element, data, type, id} 추가할요소(String), 데이터(array), 사용타입(String[modal, searchType]),  
		 * 		 select id (String)}
		 * @return{} null
		 */
		setCombobox(element, data, type, id){
			const crtEle = this.createElement;
			let width = "100%";
			const parent = element.parentNode;
			parent.removeChild(element);
			if(data.length>0){
				if(type == "popup"){
					width = "90%";	
				}else if(type == "single" || type == "multi"){
					width = "300px";
				}
				const select = crtEle("select", {id: id, style: `width:${width}; ${((type == "detail") ? 'disabled' : "")}`});
				const nullOption = crtEle("option", {value: ""});;
				if(["popup", "detail"].indexOf(type) === -1){
					nullOption.textContent = "전체";
				}
				select.appendChild(nullOption);
				for(let d of data){
					const option = crtEle("option", {value: d.cbKey});
					option.textContent = d.cbValue;
					select.appendChild(option);
				}
				if(type === "multi"){
					parent.appendChild(select);
				}else if(type === "single"){
					const searchSel = document.getElementById(`${this.prefix}_single_search_col`),
					      fieldset = searchSel.parentNode;
					fieldset.appendChild(select);
				}else if(type === "popup" || type === "detail"){
					const td = crtEle("td", {scope: "col"});
					td.appendChild(select);
					parent.appendChild(td);
				}
			}
		}
		/**
		 * 단건 조회부 조건 input 커스텀 메소드 (combo, date, datetime)
		 * @method setCustomSingleSearch
		 * @param{} null
		 * @return{} null
		 */
		setCustomSingleSearch(){
			const ag = this, searchId = `${this.prefix}_single_search_value`,
				  input = document.getElementById(searchId),
				  select = document.getElementById(`${this.prefix}_single_search_col`),
				  colM = this.column.colM, crtEle = this.createElement;
			let firstCol = "", dp = this.column.datePicker;
			for(let col of colM){
				if(col.hidden !== true && col.searchable !== false){
					firstCol = col;
					break;
				}
			}
			if(typeof firstCol.type !== "undefined"){
				if (firstCol.type == "date" || firstCol.type == "datetime"){
					const range = (firstCol.range === true) ? true : false;
					const dm = (typeof firstCol.displayMonth !== "undefined")? firstCol.displayMonth : 1;
					this.setDatePicker(searchId, firstCol.type, range, dm);
				}else if(firstCol.type == "combo"){
					this.setCombobox(input, firstCol.comboData, "single", searchId);
				}
			}
			const callback = function(){
				const dp = ag.column.datePicker;
				if(dp.length > 0){
					for(let picker of dp){
						picker.removeCalendar(picker.calendarId);
					}
					dp.length = 0;
				}
				const id = this.options[this.selectedIndex].value,
					  idx = this.options[this.selectedIndex].getAttribute("idx"),
					  searchId = `${ag.prefix}_single_search_value`,
					  input = document.getElementById(searchId),
					  colM = ag.column.colM, fieldset = select.parentNode,
					  newInput = crtEle("input", {type: "text", id: searchId,
						  autocomplete: 'off', placeholder: '검색어를입력하세요'});
				if(input !== null) input.value = "";
				if (colM[idx].type == "date" || colM[idx].type == "datetime"){
					input.parentNode.removeChild(input);
					fieldset.insertBefore(newInput, fieldset.childNodes[1]);
					const range = (colM.range === true) ? true : false;
					const dm = (typeof colM.displayMonth !== "undefined")? colM.displayMonth : 1;
					ag.setDatePicker(searchId, colM[idx].type, range, dm);
				}else if (colM[idx].type == "combo"){
					ag.setCombobox(input, colM[idx].comboData, "single", searchId);
					input.addEventListener("change", function(){
						ag.reload("search");
					})
				}else{
					if(input == null) input = document.getElementById("ag_grid_single_search_col").nextElementSibling;
					input.parentNode.removeChild(input);
					fieldset.insertBefore(newInput, fieldset.childNodes[1]);
					input.addEventListener("keyup", function(e){
						if(e.keyCode == 13) ag.reload("search");
					});
				}
				this.nextElementSibling.focus();
			}
			select.addEventListener("change", callback);
		}
		/**
		 * 행 체크박스 이벤트 등록 메소드 - 전체 체크 체크박스 기능, pre, post 함수 추가 기능
		 * @method setRowChkboxEvent
		 * @param{} null
		 * @return{} null
		 */
		setRowChkboxEvent(idx, dataSize){
			const ag = this, selectionType = this.display?.selection?.type,
				  headerTrsSize = document.querySelectorAll(`#${this.prefix}_header_table tr`).length,
				  preFunc = (typeof this.display.selection.pre === "function") ? this.display.selection.pre : null,
				  postFunc = (typeof this.display.selection.post === "function") ? this.display.selection.post : null;
			let tbody = document.querySelector(`#${this.prefix}_body_table tbody`),
				chkBoxes = tbody.querySelectorAll("input[type='checkbox']"),
			    trs = tbody.childNodes, chkAll = document.getElementById(`${this.prefix}_chkAll`);
			this.event.checkbox = function(){
				const headerSize = document.querySelectorAll(`#${ag.prefix}_header_table tr`).length,
					  fixedIdx = ag.display.fixedColIdx,
					  fixedTbody = document.querySelector(`#${ag.prefix}_body_table_fixed tbody`),
					  fixedChkBoxes = fixedTbody?.querySelectorAll("input[type='checkbox']"),
					  trIndex = this.closest("tr").rowIndex - headerTrsSize,
					  fixedTrBoolean = (this.closest("tr").id.indexOf("fixed") === -1) ? false : true;
				/*행 클릭 이벤트시 체크박스는 this.chekced가 변경 전 값으로, 체크박스 변경 이벤트는 변경된 값으로 확인된다.
				 * 두 값의 동기화를 위해  행클릭 이벤트의 경우 this.checked 값을 변경처리한다.*/
				if(event.type === "click") {
					this.checked = !this.checked;
				}
				/*전처리 함수의 결과가 true일 경우 변경처리, false일 경우 기존 체크박스checked를 유지한다. */
				if(preFunc !== null){
					const data = ag.getRowData(trIndex), returnPre = preFunc.call(this, data);
					if(!returnPre) this.checked = !this.checked;
				}
				/*single 일 경우 행 체크는 단일, 복수일 경우 체크된 개수가 전체개수와 다르면 체크 해제/같으면 체크 기능 처리*/
				let cb = (fixedTrBoolean) ? fixedChkBoxes : chkBoxes;
				if(selectionType === "single"){
					for(let chkBox of cb){
						if(this !== chkBox) chkBox.checked = false;
					}
				}else if(selectionType === "multi"){ /*multi의 경우 전체 체크박스 개수와 체크된 개수가 다르면 체크를 해제한다.*/
					if(fixedTrBoolean) tbody = fixedTbody;
					const checkedSize = tbody.querySelectorAll("input[type='checkbox']:checked").length,
						  checkBoxSize = cb.length;
					if(checkedSize !== checkBoxSize){
						chkAll.checked = false;
					}else{
						chkAll.checked = true;
					}
				}
				/*fixed 옵션이 있을 경우 동기화처리*/
				if(fixedIdx !== null){
					if(fixedTrBoolean){
						for(let [index, chkBox] of chkBoxes.entries()){
							chkBox.checked = fixedChkBoxes[index].checked;
						}
					}else{
						for(let [index, chkBox] of fixedChkBoxes.entries()){
							fixedChkBoxes[index].checked = chkBoxes[index].checked;
						}
					}
				}
				if(postFunc !== null) postFunc.call(this);
			}
			/*체크박스를 제외한 td 클릭과 체크박스 change 이벤트를 등록한다.*/
			for(let tr of trs){
				const chkBox = tr.querySelector("input[type='checkbox']"),
					  tds = tr.children;
				chkBox.addEventListener("change", this.event.checkbox.bind(chkBox));
				for(let td of tds){
					if(!td.classList.contains("ag_body_chk")){ /*체크박스를 제외하로 행클릭 이벤트 등록*/
						td.addEventListener("click", this.event.checkbox.bind(chkBox));
					}
				}
			}
		}
		/**
		 * 행 클릭 이벤트 추가 메소드
		 * @method setOnClickRowEvent
		 * @param{} null
		 * @return{} null
		 */
		setOnClickRowEvent(idx, dataSize){
			const ag = this, rows = this.getTbody().children, size = rows.length,
				  clickRowEvent = this.additionalFunc.onClickRow, colM = this.column.colM,
				  chkboxIdx = (this.display.selection.type !== "none") ? 1 : 0,
				  fixedIdx = this.display.fixedColIdx;
			this.event.onClickRow = function(){
				const grid = document.getElementById(ag.id),
					  selRows = grid.querySelectorAll(`.${ag.getCss("selectedRow")}`),
					  headerTrsSize = document.querySelectorAll(`#${ag.prefix}_header_table tr`).length,
					  tr = this.parentElement,
					  data = ag.getRowData(tr.rowIndex - headerTrsSize);
				for(let selRow of selRows){
					selRow.classList.remove(`${ag.getCss("selectedRow")}`);
				}
				let selRowId = `${ag.prefix}_row_${tr.rowIndex-1}`;
				document.getElementById(selRowId).classList.add(`${ag.getCss("selectedRow")}`);
				if(fixedIdx !== null) document.getElementById(`${selRowId}_fixed`).classList.add(`${ag.getCss("selectedRow")}`);
				clickRowEvent.call(tr, data, tr.getAttribute("id"), ag.getDomIndex(tr));
			}
			idx = idx ?? 0;
			const startIdx = idx, endIdx = dataSize + idx;
			for(let i=startIdx; i<endIdx; i++){
				const data = {}, tr = rows[i];
				tr.style.cursor = "pointer";
				tr.tabIndex = 0;
				for(let j=0; j<colM.length; j++){
					const td = tr.children[j+chkboxIdx];
					data[colM[j].id] = td.textContent;
					td.addEventListener("click", ag.event.onClickRow.bind(td));
				}
			}
		}
		/**
		 * 정렬 기능 이벤트 추가 메소드 - 변경시 reload 실행
		 * @method setSortEvent
		 * @param{} null
		 * @return{} null
		 */
		setSortEvent(){
			const ag = this, colM = this.column.colM, fixedIdx = this.display.fixedColIdx,
				  headerTbl = document.getElementById(`${this.prefix}_header_table`)
			ag.event.sort = function(){
				const fixedChkAll = document.querySelector(`#${ag.prefix}_chkAll_fixed`),
				  	  chkAll = document.querySelector(`#${ag.prefix}_chkAll`);
				if(fixedChkAll !== null) fixedChkAll.checked = false;
				if(chkAll !== null) chkAll.checked = false;
				const div = this.children[0], divClass = div.classList, sortData = ag.data.sorting, 
					  colN = div.getAttribute("name").split(`${ag.prefix}_`)[1],
					  colmIdx = ag.getColmIdx(colN), colM = ag.column.colM[colmIdx],
					  bodyClass = document.getElementById(`${ag.prefix}_body`).classList;
				const getObj = function(param){
					const returnObj = {};
					for(let key in param){
						if(typeof param[key] !== "undefined"){
							returnObj[key] = param[key];
						}
					}
					return returnObj;
				}
				let sortObj = {};
				if(!bodyClass.contains(`${ag.getCss("bodyTblNoData")}`)){
					const idx = ag.getDomIndex(this);
					for(let i=sortData.length; i--;){
						if(sortData[i].column === colN){
							sortData.splice(i, 1);
						}
					}
					if(divClass.length === 0){
						divClass.add("desc");
						sortData.push(getObj({column: colN, order: "desc", combo : colM.comboData}));
					}else{
						if(divClass.contains("desc")){
							divClass.remove("desc");
							divClass.add("asc");
							sortData.push(getObj({column: colN, order: "asc", combo : colM.comboData}));
						}else if(divClass.contains("asc")){
							divClass.remove("asc");
						}
					}
				}
				ag.reload("search");
			}
			for(let col of colM){
				if(col.hidden !== true && col.sortable !== false){
					const divs = headerTbl.querySelectorAll(`div[name=${this.prefix}_${col.id}]`);
					for(let div of divs){
						const td = div.closest("td"), /* div.parentElement */
					      	  tr = div.closest("tr"); /* div.parentElement.parentElement */
						if(td.hasAttribute("rowspan") || tr.getAttribute("id") === `${this.prefix}_header_tr`){
							if(!td.getAttribute("hidden")){
								td.style.cursor = "pointer";
								td.addEventListener("click", ag.event.sort);
							}
						}
					}
				}
			}
		}
		/**
		 * 컬럼 드레그로 순서를 변경하는 이벤트 추가 메소드
		 * @method setReorderEvent - header mouseover, out, move, up, dragstart
		 * 		   보이는 화면 외 colM 배열순서 변경, bodyheader순서 변경,
		 * @param{} null
		 * @return{} null
		 */
		setReorderEvent(){
			const ag = this, crtEle = this.createElement, css = this.getCss,
				  colGroup = this.column.group, sel = this.display.selection;
			let dragDiv = document.getElementById("ag_dragDiv"),
				header = null, size = 0, fixedIdx = this.display.fixedColIdx;
			if(sel.type !== "none" && fixedIdx !== null) fixedIdx += 1;
			if(dragDiv === null){
				dragDiv = crtEle("div", {id: "ag_dragDiv", class: css("headerDragDiv"),
					style: "display:none;", selIdx: "0"});
				document.body.appendChild(dragDiv);
			}
			if(colGroup.length > 0){
				header = document.getElementById(`${ag.prefix}_header_tr_group_0`).children;
			}else{
				header = document.getElementById(`${ag.prefix}_header_tr`).children;
			}
			size = header.length;
			const getIdx = function(srcIdx, tarIdx){
				const obj = {
					srcIdxs: [],
					tarIdxs: [],
					srcBodyIdxs: [],
					tarBodyIdxs: [],
					srcColMIdxs: [],
					tarColMIdxs: []
				},
				headerTbl = document.getElementById(`${ag.prefix}_header_table`),
				sel = ag.display.selection, chkYn = (sel.type == "none") ? 0 : 1,
				srcColspan = headerTbl.rows[0].cells[srcIdx].getAttribute("colspan"),
				lastTr = document.getElementById(`${ag.prefix}_header_tr`),
				srcIdxs = obj.srcIdxs, tarIdxs = obj.tarIdxs;
			    if(srcColspan !== null){
			    	for(let i=srcIdx, n=srcIdx+parseInt(srcColspan); i<n; i++){
			    		srcIdxs.push(i);
			    	}
			    }else{
			    	srcIdxs.push(srcIdx);
			    }
			    if(typeof tarIdx !== "undefined"){
			    	const tarColspan = headerTbl.rows[0].cells[tarIdx].getAttribute("colspan");
				    if(tarColspan !== null){
				    	for(let i=tarIdx, n=tarIdx+parseInt(tarColspan); i<n; i++){
				    		tarIdxs.push(i);	
				    	}
				    }else{
				    	tarIdxs.push(tarIdx);
				    }
			    }
			    for(let idx of srcIdxs){
			    	const id = lastTr.cells[idx].children[0].getAttribute("name").replace(`${ag.prefix}_`, "");
			    	obj.srcBodyIdxs.push(ag.getColmIdx(id)+chkYn);
					obj.srcColMIdxs.push(ag.getColmIdx(id));
			    }
			    if(tarIdxs.length > 0){
			    	for(let idx of tarIdxs){
				    	const id = lastTr.cells[idx].children[0].getAttribute("name").replace(`${ag.prefix}_`, "");
						obj.tarBodyIdxs.push(ag.getColmIdx(id)+chkYn);
						obj.tarColMIdxs.push(ag.getColmIdx(id));
				    }
			    	let temp, cnt = 0, startPoint, endPoint;
			    	const srcColIdxs = obj.srcColMIdxs, tarColIdxs = obj.tarColMIdxs,
			    		  colM = ag.column.colM;
			    	for(let i=srcColIdxs[0]; i<=srcColIdxs[srcColIdxs.length-1]; i++){
			    		if(srcIdx < tarIdx){
			    			startPoint = i-cnt;
			    			endPoint = tarColIdxs[tarColIdxs.length-1];	
			    		}else{
			    			startPoint = i;
							endPoint = tarColIdxs[0]+cnt;
			    		}
			    		temp = colM[startPoint];
			    		colM.splice(startPoint, 1);			    		
			    		colM.splice(endPoint, 0, temp);
			    		cnt++;
			    	}
			    }
			    return obj;
			}
			const mouseover = function(e){
				this.classList.add("ag_hovering");
				e.preventDefault();
			}
			const mouseout = function(e){
				this.classList.remove("ag_hovering");
				e.preventDefault();
			}
			const mousemove = function(e){
				if(dragDiv.style.display == "block"){
					dragDiv.style.top = (e.pageY+5)+"px";
					dragDiv.style.left = (e.pageX+10)+"px";
				}
			}
			const mouseup = function(e){
				if(fixedIdx !== null){
					if(this.cellIndex <= fixedIdx){
						return false;
					}
				}
				if(dragDiv.style.display == "block"){
					let startIdx = null, endIdx = null;
					const srcIdx = Number(dragDiv.getAttribute("selIdx")),
						  tarIdx = this.cellIndex,
						  idxObj = getIdx(srcIdx, tarIdx),
						  srcIdxs = idxObj.srcIdxs, srcSize = srcIdxs.length,
						  tarIdxs = idxObj.tarIdxs,
						  sbi = idxObj.srcBodyIdxs, tbi = idxObj.tarBodyIdxs,
						  headerTrs = document.querySelectorAll(`#${ag.prefix}_header_table tr`),
						  bodyTrs = document.querySelectorAll(`#${ag.prefix}_body_table tr`),
						  colgroups = document.querySelectorAll(`#${ag.prefix} colgroup`);
					if(srcIdx > tarIdx){
						endIdx = tarIdxs[0];
						for(let htr of headerTrs){
							const tds = htr.children;
							for(let i=0, n=srcSize; i<n; i++){
								htr.insertBefore(tds[srcIdxs[i]], tds[endIdx+i]);
							}
						}
						for(let cg of colgroups){
							const col = cg.children;
							for(let i=0, n=srcSize; i<n; i++){
								cg.insertBefore(col[srcIdxs[i]], col[endIdx+i]);
							}
						}
						for(let tr of bodyTrs){
							const tds = tr.children;
							if(tr.getAttribute("id").indexOf(`${ag.prefix}_row`) !== -1){
								for(let i=0, n=sbi.length; i<n; i++){
									startIdx = sbi[i];
				    				endIdx = tbi[0]+i;
					    			tr.insertBefore(tds[startIdx], tds[endIdx]);
								}
							}else{
								startIdx = sbi[0];
				    			endIdx = tbi[tbi.length-1]+1;
				    			for(let i=0, n=sbi.length; i<n; i++){
					    			tr.insertBefore(tds[startIdx], tds[endIdx]);	
					    		}	
							}
						}
					}else{
						startIdx = srcIdxs[0];
				    	endIdx = tarIdxs[tarIdxs.length-1]+1;
				    	for(let htr of headerTrs){
				    		const tds = htr.children;
				    		for(let i=0, n=srcIdxs.length; i<n; i++){
				    			htr.insertBefore(tds[startIdx], tds[endIdx]);
				    		}
				    	}
				    	for(let cg of colgroups){
				    		const col = cg.children;
				    		for(let i=0, n=srcIdxs.length; i<n; i++){
				    			cg.insertBefore(col[startIdx], col[endIdx]);
				    		}
				    	}
				    	for(let tr of bodyTrs){
				    		const tds = tr.children;
				    		if(tr.classList.contains("ag_body_row")){
				    			startIdx = sbi[0];
				    			endIdx = tbi[tbi.length-1]+1;
				    			for(let i=startIdx, n=sbi[sbi.length-1]+1; i<n; i++){
					    			tr.insertBefore(tds[startIdx], tds[endIdx]);
					    		}
				    		}else{
				    			startIdx = sbi[0];
				    			endIdx = tbi[tbi.length-1]+1;
				    			for(let i=0, n=srcSize; i<n; i++){
					    			tr.insertBefore(tds[startIdx], tds[endIdx]);	
					    		}
				    		}
				    	}
					}
					/*컬럼 위치를 이동할 경우 1px의 오차가 발생..원인 찾아야함*/
					ag.appendBodyHeader();
					document.getElementsByClassName("ag_dragging")[0].classList.remove("ag_dragging");
				}
			}
			const dragstart = function(e){
				if(fixedIdx !== null){
					if(this.cellIndex <= fixedIdx){
						return false;
					}
				}
				const dragStyle = dragDiv.style;
				if(dragStyle.display === "none"){
					dragStyle.display = "block";
					dragDiv.setAttribute("selIdx", this.cellIndex);
					this.classList.add("ag_dragging");
					dragStyle.width = this.clientWidth+"px";
					dragStyle.top = (e.pageY+5)+"px";
					dragStyle.left = (e.pageX+10)+"px";
					const dragTbl = crtEle("table", {class: css("bodyTbl")}),
						  colGrp = crtEle("colGroup"), srcIdx = this.cellIndex,
						  bodyTbl = document.getElementById(`${ag.prefix}_body_table`),
						  cols = bodyTbl.querySelector("colGroup").children,
						  bodyRows = bodyTbl.rows, idxObj = getIdx(srcIdx);
					dragDiv.appendChild(dragTbl);
					let tds = null, col = null;
					for(let i=0, n=bodyRows.length; i<n; i++){
						const tr = bodyRows[i].cloneNode(false);
						for(let j=0, m=idxObj.srcIdxs.length; j<m; j++){
							if(tr.getAttribute("id").indexOf(`${ag.prefix}_row`) !== -1){
				        		tds = bodyRows[i].cells[idxObj.srcBodyIdxs[j]].cloneNode(true);
				        	}else{
				        		tds = bodyRows[i].cells[idxObj.srcIdxs[j]].cloneNode(true);
				        	}
					        tr.appendChild(tds);
						}
						dragTbl.appendChild(tr);
					}
					for(let i=0, n=idxObj.srcBodyIdxs.length; i<n; i++){
			    		col = cols[idxObj.srcIdxs[i]].cloneNode(true);
			    		colGrp.appendChild(col);
			    	}
			    	dragTbl.appendChild(colGrp);
				    e.preventDefault();
				}
			}
			let i=0;
			for(((sel.type !== "none") ? i=1 : i=0); i<size-1; i++){
				header[i].draggable = true;
				header[i].ondragstart = dragstart;
				header[i].onmouseover = mouseover;
				header[i].onmouseout = mouseout;
				header[i].onmouseup = mouseup;
				header[i].className = "ag_tableHeader";
			}
			document.body.onmousemove = mousemove;
			
			document.body.onmouseup = function(e){
				dragDiv.style.display = "none";
				dragDiv.innerHTML = "";
				header[Number(dragDiv.getAttribute("selIdx"))].classList.remove("ag_dragging");
		        e.preventDefault();
			}
		}
		/**
		 * 체크된 행 데이터를 리턴하는 메소드
		 * @method getCheckedRowsData
		 * @param{booleanKey} true 일경우 콤보박스의 경우 키값 전달 else value 전달 
		 * @return{dataObject} 행 데이터 오브젝트(hidden컬럼도 추가됨)
		 */
		getCheckedRowsData(booleanKey){
			const bodyTbl = document.getElementById(`${this.prefix}_body_table`),
				  chkboxDiv = bodyTbl.querySelectorAll(`div[name=${this.prefix}_row_chk_div]`),
				  dataArray = [], sel = this.display.selection, colM = this.column.colM,
				  selIdx = (sel.type == "none") ? 0 : 1, postData = this.data.postData;
			for(let div of chkboxDiv){
				const chkbox = div.querySelector("input[type='checkbox']");
				const data = {}, headerTrsSize = document.querySelectorAll(`#${this.prefix}_header_table tr`).length;
				if(chkbox.checked){
					const tr = chkbox.closest("tr");
					for(let i=0, n=colM.length; i<n; i++){
						const value = tr.children[i+selIdx].textContent;
						if(booleanKey){
							if(colM[i].type === "combo"){
								const cd = colM[i].comboData;
								combo : for(let d of cd){
									if(value == d.cbValue){
										data[colM[i].id] = d.cbKey;
										break combo;
									}
								}
							}else{
								data[colM[i].id] = value;
							}
						}else{
							data[colM[i].id] = value;							
						}
					}
					data.rowIdx = tr.rowIndex-headerTrsSize;
					dataArray.push(data);
				}
			}
			for(let key in postData){
				for(let data of dataArray){
					data[key] = postData[key];
				}	
			}
			return dataArray;
		}
		/**
		 * 그리드 바디의 tbody 리턴 메소드
		 * @method getTbody
		 * @param{} null
		 * @return{DOM} htmlCollection 
		 */
		getTbody(){
			return document.querySelector(`#${this.prefix}_body_table tbody`);
		}
		/**
		 * 행의 인덱스를 받아 행의 데이터를 리턴하는 메소드
		 * @method getTbody
		 * @param{rowIdx} 행의 인덱스
		 * @return{dataObject} 행 데이터 오브젝트(hidden컬럼 추가) 
		 */
		getRowData(rowIdx){
			const data = {}, row = document.getElementById(`${this.prefix}_row_${rowIdx}`),
				  selIdx = (this.display.selection.type !== "none") ? 1 : 0, colM = this.column.colM;
			if(row !== null){
				for(let i=0, n=colM.length; i<n; i++){
					data[colM[i].id] = row.children[i+selIdx].textContent;	
				}
			}
			return data;
		}
		/**
		 * 전달받은 element의 인덱스를 리턴해주는 메소드
		 * @method getDomIndex
		 * @param{element, range} 인덱스를 리턴할 요소(DOM), 범위(DOM)
		 * @return{domIndex} 돔인덱스(int)
		 */
		getDomIndex(element, range){
			if(!!range){
				return Array.prototype.indexOf.call(document.querySelectorAll(range), element);
			}else{
				let eleArray = Array.prototype.slice.call(element.parentNode.children);
				const isSame = function(value){
					return value.tagName == element.tagName;
				}
				eleArray = eleArray.filter(isSame);
				return Array.prototype.indexOf.call(eleArray, element);	
			}
		}
		/**
		 * id로 colM의 인덱스 값을 리턴해주는 메소드
		 * @method getColmIdx
		 * @param{id} colM id (String)
		 * @return{arrayIndex} 배열의 인덱스(int)
		 */
		getColmIdx(id){
			const colM = this.column.colM;
			for(let [i, c] of colM.entries()){
				if(c.id == id) return i;
			}
		}
		/**
		 * single search일 경우 조회 데이터를 리턴해주는 메소드
		 * @method getSingleSearchData
		 * @param{} null
		 * @return{record : data} 조회 데이터 Object
		 */
		getSingleSearchData(){
			const data = {}, colM = this.column.colM,
			      select = document.getElementById(`${this.prefix}_single_search_col`),
				  id = select.options[select.selectedIndex].value,
			      type = select.options[select.selectedIndex].getAttribute("type"),
			      searchId = `${this.prefix}_single_search_value`,
			      keyword = document.getElementById(searchId).value,
			      regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"|\s]/gi;
			let idx = null;
			if(type == "date" || type == "datetime"){
				if(keyword !== ""){
					idx = this.getColmIdx(id);
					if(colM[idx].range) data[`${colM[idx].id}_range`] = colM[idx].range;
					data[id] = [document.getElementById(searchId).value.replace(regExp, "")];
				}
			}else if (type == "combo"){
				const ele = document.getElementById(searchId);
				if(ele.options[ele.selectedIndex].value !== ""){
					data[id] = [ele.options[ele.selectedIndex].value];	
				}
			}else{
				if(keyword !== ""){
					data[id] = [document.getElementById(searchId).value];
				}
			}
			return {record: data};
		}
		/**
		 * 최종적으로 서버로 전달할 데이터를 생성 해 리턴해주는 메소드 - type이 excel일 경우 필요한 데이터 추가 
		 * @method getPostData
		 * @param{} null
		 * @return{object} 데이터 Object (paging, sorting, postData, excelData)
		 */
		getPostData(type){
			const data = this.data, postData = data.postData,
				  column = this.column, colM = column.colM, colN = column.colN,
				  searchType = this.data.search.type,
				  div = document.getElementById(this.id);
			let returnData = {};
			if(searchType === "single"){
				returnData = this.getSingleSearchData(); 
			}else if(searchType === "multi"){
				returnData = this.getMultiSearchData();
			}
			/*페이징 데이터 세팅*/
			returnData.paging = data.paging;
			/*정렬 데이터 세팅*/
			returnData.sorting = data.sorting;
			/*옵션 postData 세팅*/
			returnData.postData = {};
			for(let key in postData){
				returnData.postData[key] = postData[key];
			}
			/*엑셀의 경우 colM, colN 추가*/
			if(type == "excel"){
				const newColN = [], newColM = [];
				for(let [i, colm] of colM.entries()){
					if(colm.hidden !== false && colm.excel !== false){
						newColN.push(colN[i]);
						newColM.push(colm.id);
					}
				}
				returnData.excel = {
					colN: newColN,
					colM: newColM,
					sheetName: (typeof this.title !== "undefined") ? "sheet1" : this.title
				}
				if(column.group.length > 0){
					returnData.excel.columnGroup = returnData.group;
				}
				/* footer summary가 있을 경우 해당 데이터 전달*/
				const tfoot = div.querySelector("tfoot");
				const footTrs = tfoot.children;
				if(footTrs.length > 0){
					returnData.excel.summary = [];
					for(let tr of footTrs){
						const tds = tr.children;
						const tdArray = [];
						for(let td of tds){
							const obj = {
								text: td.innerText,
								colspan: td.getAttribute('colspan'),
								rowspan: td.getAttribute('rowspan')
							}
							tdArray.push(obj);
						}
						returnData.excel.summary.push(tdArray);
					}
				}
			}
			return returnData;
		}
		/**
		 * 페이지 리로드 메소드 
		 * @method reload
		 * @param{type} 조회타입 (String['search', 'page'])
		 * @return{object} 데이터 Object (paging, sorting, postData, excelData)
		 */
		reload(type){
			const pageData = this.data.paging, sel = this.display.selection;
			if(type === "search") pageData.pageIndex = 1;
			if(sel.type == "multi") {
				document.getElementById(`${this.prefix}_chkAll`).removeAttribute("checked");
				if(this.display.fixedColIdx !== null){
					document.getElementById(`${this.prefix}_chkAll_fixed`).removeAttribute("checked");
				}
			}
			if(this.editType == "detail") this.detailChgMode("C");
			const footerTable = document.getElementById(this.id).querySelector(".ag_footer");
			if(footerTable !== null) this.removeElement(document.getElementById(`${this.prefix}_footer`));
			this.getData();
		}
		/**
		 * 전체 행 삭제 메소드 
		 * @method removeRows
		 * @param{} null
		 * @return{} null
		 */
		removeRows(){
			const tbody = this.getTbody(), bodyClass = document.getElementById(`${this.prefix}_body`).classList;
			tbody.innerHTML = "";
			bodyClass.add(`${this.getCss("bodyTblNoData")}`);
		}
		/**
		 * 리턴받은 데이터 세팅 메소드 - totalCount 표출, appendRows호출 
		 * @method setData
		 * @param{response} Object
		 * @return{} null
		 */
		setData(response){
			const data = response.rows, size = data.length;
			this.data.paging.totalCount = response.totalCnt;
			if(this.display.totalCount === true){
				const commaNum = ((typeof response.totalCnt !== "undefined") ? this.getNumString(response.totalCnt) : 0);
				document.getElementById(`${this.prefix}_total_cnt`).textContent = commaNum;
			}
			this.appendRows(data);
		}
		/**
		 * DOM 스타일 세팅 메소드 
		 * @method setStyle
		 * @param{colM, location} colM Object, 스타일 설정 위치 String('body')
		 * @return{} null
		 */
		setStyle(colM, location){
			let style = "";
			if(!!colM.hidden){
				style += (colM.hidden)?"display:none;":"";
			}
			if(location === "body"){
				if(!!colM.align) style += "text-align:"+colM.align+';';
			}
			return style;
		}
		/**
		 * DOM 생성 메소드 
		 * @method createElement
		 * @param{tag, properties} 생성할 DOM태그 (String), 추가할 properties (Object)
		 * @return{DOM} 생성한 DOM
		 */
		createElement(tag, properties){
			const ele = document.createElement(tag);
			for(let p in properties){
				if(p === "class"){
					if(properties[p].indexOf(" ") !== -1){
						const classArray = properties[p].split(" ");
						for(let classNm of classArray){
							ele.classList.add(classNm);	
						}
					}else{
						ele.classList.add(properties[p]);	
					}
				}else if(p === "txt"){
					ele.textContent = properties[p];
				}else{
					ele.setAttribute(p, properties[p]);
				}
			}
			return ele;
		}
		/**
		 * DOM 요소 삭제 메소드 
		 * @method removeElement
		 * @param{ele} 삭제할 DOM 요소
		 * @return{} null
		 */
		removeElement(ele){
			if(!!ele) ele.parentElement.removeChild(ele);
		}
		/**
		 * 현재 년월일 시분을 리턴해주는 메소드 
		 * @method getDateString
		 * @param{} null
		 * @return{date} dateString(년월일시분)
		 */
		getDateString(){
			const date = new Date();
			let yyyy,mm,dd,hh,mi;
			yyyy = date.getFullYear().toString();
			mm = this.addZero(date.getMonth() + 1);
			dd = this.addZero(date.getDate());
			hh = this.addZero(date.getHours());
			mi = this.addZero(date.getMinutes());
			return yyyy+mm+dd+hh+mi;
		}
		/**
		 * 숫자 3자리마다 콤마 추가해 String으로 리턴해주는 메소드  
		 * @method getNumString
		 * @param{num} 숫자 (int)
		 * @return{StringNumber} 3자리마다 콤마가 찍힌 문자형 숫자
		 */
		getNumString(num){
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		/**
		 * 1자리 숫자 앞에 '0' 추가해 리턴해주는 메소드  
		 * @method addZero
		 * @param{date} 숫자 (int)
		 * @return{StringNumber} 3 -> 03 return
		 */
		addZero(data){
			const numStr = data+"";
			return (numStr[1]) ? numStr : '0'+numStr[0];
		}
		/**
		 * 데이터 조회 메소드 - 테이블 바디에 nodata, loading 토글, pagingData update
		 * @method getData
		 * @param{} null
		 * @return{} null
		 */
		getData(){
			const ag = this, fixedTbody = document.querySelector(`#${this.prefix}_body_table_fixed tbody`),
				  bodyDiv = document.getElementById(`${ag.prefix}_body`),
				  bodyClass = bodyDiv.classList, pageData = ag.data.paging;
			this.removeRows();
			bodyClass.add(`${this.getCss("bodyTblLoading")}`);
			this.ajax(this.url, "", function(returnData){
				if(returnData.totalCnt > 0){
					bodyClass.remove(`${ag.getCss("bodyTblNoData")}`);
					ag.setData(returnData);
				}else{
					console.log("데이터가 존재하지 않습니다.");
					bodyClass.add(`${ag.getCss("bodyTblNoData")}`);
					bodyClass.remove(`${ag.getCss("bodyTblLoading")}`);
					if(ag.display.totalCount !== false) document.getElementById(`${ag.prefix}_total_cnt`).textContent = 0;
				}
				pageData.totalPage = returnData.totalPage;
				pageData.firstPageOnPageList = returnData.firstPageOnPageList;
				pageData.lastPageOnPageList = returnData.lastPageOnPageList;
				if(ag.display.page !== false) ag.updatePage();
			});
		}
		/**
		 * 비동기 조회 메소드
		 * @method ajax
		 * @param{url, params, callback type} 조회url(String), 파라메터Object, callback함수, 엑셀타입구분(String)
		 * @return{} null
		 */
		ajax(url, params, callback, type){
			const ag = this, xhr = new XMLHttpRequest(),
				  bodyDiv = document.getElementById(`${ag.prefix}_body`);
			if(Object.keys(params).length == 0 || params == "") params = this.getPostData(type);
			xhr.open("POST", url);
			xhr.responseType = "json";
			if(type == "excel") xhr.responseType = "blob";
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8;");
			xhr.onload = function(e) {
				if (this.status == 200) {
					if(type == "excel"){
						if(typeof ag.excel !== "undefined" && typeof  ag.excel.post !== "undefined") ag.excel.post();
						const filename = ((ag.title) ? ag.title : "엑셀다운로드")+`_${ag.getDateString()}.xlsx`;
						const blob = new Blob([this.response]);
						if (navigator.msSaveOrOpenBlob) { /*IE의 경우 access deny 에러 처리*/
						    navigator.msSaveOrOpenBlob(blob, filename);
						}else{
							const downloadUrl = URL.createObjectURL(blob);
				            const a = ag.createElement("a", {href: downloadUrl, download: filename});
				            document.body.appendChild(a);
				            a.click();
				            document.body.removeChild(a);
						}
						if(typeof ag.excel?.post === "function") ag.excel.post();
					}else{
						let returnData = null;
						if(ag.browser == "ie"){
							returnData = JSON.parse(this.response);
						}else{
							returnData = this.response;
						}
						if(typeof callback !== "undefined") callback(returnData);						
					}
				}
			};
			xhr.onreadystatechange = function(){
				if(this.status == 200 && this.readyState == 2){
					console.log("loading...");
				}else if(this.status == 200 && this.readyState == 4){
					console.log("end loading...");
				}else if(this.status == 404 && this.readyState == 4){
					bodyDiv.classList.add(`${ag.getCss("bodyTblNoData")}`);
					bodyDiv.classList.remove(`${ag.getCss("bodyTblLoading")}`);
					alert("요청하신 URL을 찾을 수 없습니다!");
				}else if(this.status == 400 && this.readyState == 4){
					bodyDiv.classList.add(`${ag.getCss("bodyTblNoData")}`);
					bodyDiv.classList.remove(`${ag.getCss("bodyTblLoading")}`);
					alert("잘못된 요청입니다! URL 및 매개변수를 확인하세요!");
				}
			};
			bodyDiv.classList.remove(`${ag.getCss("bodyTblNoData")}`);
			xhr.send(JSON.stringify(params));
		}
	}
	window.AG = function(options){
		class LOCAL_GRID extends AG_GRID{
			constructor(options){
				super(options);
			}
		}
		return new LOCAL_GRID(options);
	}
	window.AG.getProto = function(){
		return AG_GRID;
	}
})();