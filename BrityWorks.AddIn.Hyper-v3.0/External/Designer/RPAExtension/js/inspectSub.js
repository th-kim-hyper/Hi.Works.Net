/* globals chrome */

var BrityWorksExtension = BrityWorksExtension || (() => {
    class Inspector {
        constructor() {
            this.win = window;
            this.doc = window.document;

            this.draw = this.draw.bind(this);
            this.frameFirstDraw = this.frameFirstDraw.bind(this);
            this.drawMultiple = this.drawMultiple.bind(this);
            this.frameFirstDrawMultiple = this.frameFirstDrawMultiple.bind(this);
            this.setOptions = this.setOptions.bind(this);

            this.cssNode = 'RPA-css';
            this.contentNode = 'RPA-content';
            this.overlayElement = 'RPA-overlay';
            this.overlaySvg = 'RPA-overlaySvg';
            this.contentListClassName = 'RPA-MultipleContent';

            this.designerXPath = '';
            this.designerSelector = '';
            this.Query = '';
            this.singleQueryForMultiple = '';
            this.getXPathData = this.getXPathData.bind(this);
            this.getXPath = this.getXPath.bind(this);
            this.getXPathMultiple = this.getXPathMultiple.bind(this);
            this.getSelectorData = this.getSelectorData.bind(this);
            this.getCSSSelector = this.getCSSSelector.bind(this);
            this.getCSSSelectorMultiple = this.getCSSSelectorMultiple.bind(this);
            this.preventClick = this.preventClick.bind(this);
            this.responseType = 'selector';
            this.isResponseMultiple = false;
            this.src = '';
            this.href = '';
            this.isIFrame = false;
            this.tagName = '';
            this.isEditable = false;
            this.columnCnt = 0;
            this.isValid = false;
            this.elementHTML = '';
            this.changeOverlayBGColor = this.changeOverlayBGColor.bind(this);
            this.isPause = false;
            this.isTable = false;
            this.isActivate = false;
            this.monitorState = this.monitorState.bind(this);
            this.isSleepMode = false;
            this.DiagonalType = '';
            this.isPassword = false;
            this.invalidTargetLeft = 0;
            this.invalidTargetRight = 0;
            this.sendWake = this.sendWake.bind(this);

            this.saveIFrameToBG = this.saveIFrameToBG.bind(this);
            this.loadIFrameFromBG = this.loadIFrameFromBG.bind(this);
            this.loadIsPauseFromBG = this.loadIsPauseFromBG.bind(this);
            this.sendData = this.sendData.bind(this);
            this.sendQuery = this.sendQuery.bind(this);
 
            this.ChromeElements = [];
            this.getDualXPath = this.getDualXPath.bind(this);
            this.getDualSelector = this.getDualSelector.bind(this);
            this.getFullHTML = this.getFullHTML.bind(this);
            this.fullHTML = '';
            this.shortQuery = '';

            this.preventClickEnable = false;

            this.isStartFrame = false;
            this.saveMousePositionEnable = false;
            this.currentScreenX = -1;
            this.currentScreenY = -1;
            this.sendDataWithFrameIndex = this.sendDataWithFrameIndex.bind(this);
            this.saveMousePosition = this.saveMousePosition.bind(this);
            this.calcFrameIndex = this.calcFrameIndex.bind(this);
            this.indexArr = [];
            this.indexTagArr = [];

            this.selectedElements = [];
            this.selectedElementsQuery = [];
            this.scrapingQuery = this.scrapingQuery.bind(this);
            this.mergedQuery = '';
            this.overlayElementMultiple = 'RPA-overlayMultiple';
            this.overlaySvgMultiple = 'RPA-overlaySvgMultiple';
            this.getMergedSelectorAll = this.getMergedSelectorAll.bind(this);
            this.createOverlayElementsForMultipleSelectedTarget = this.createOverlayElementsForMultipleSelectedTarget.bind(this);
            this.removeOverlayElementsForMultipleSelectedTarget = this.removeOverlayElementsForMultipleSelectedTarget.bind(this);
            this.createOverlayElementsForMultipleSelectedObject = this.createOverlayElementsForMultipleSelectedObject.bind(this);
            this.removeOverlayElementsForMultipleSelectedObject = this.removeOverlayElementsForMultipleSelectedObject.bind(this);
            this.drawSelectedElements = this.drawSelectedElements.bind(this);
            this.drawMultipleFromQuery = this.drawMultipleFromQuery.bind(this);
            this.drawMultipleFromSelectedElements = this.drawMultipleFromSelectedElements.bind(this);
            this.initScrapingInfo = this.initScrapingInfo.bind(this);
            this.setSelectMode = this.setSelectMode.bind(this);

			this.selectMode = 'single';
			this.isMultiSelectMode = this.isMultiSelectMode.bind(this);
            this.isFormSelectMode = this.isFormSelectMode.bind(this);
			this.isNormalMode = this.isNormalMode.bind(this);
			this.formSelectedElements = [];
			this.formChangedElements = [];
            this.getElementAbsolutePos = this.getElementAbsolutePos.bind(this);
            this.resize = this.resize.bind(this);
            this.clickedNode = null;
			this.sendSelectedElementsLength = this.sendSelectedElementsLength.bind(this);
			this.setStateMode = this.setStateMode.bind(this);
			this.isReadOnlyStateMode = false;
			this.isHideStateMode = false;
			this.selectedFormNode = null;
			this.searchCanManagedElemnts = this.searchCanManagedElemnts.bind(this);
			this.formPreDraw = this.formPreDraw.bind(this);
			this.searchModifiedElements = this.searchModifiedElements.bind(this);
			this.isElementDisplayNone = this.isElementDisplayNone.bind(this);
			this.isExistSelectedFormNode = this.isExistSelectedFormNode.bind(this);
			this.constFormSelectMsg = 'Form Selection Mode';
			this.constFormInputMsg = 'Value Input Mode';
			this.constFormSelectedElementsColor = 'rgba(0, 0, 250, 0.7)';
			this.constFormSelectedElementsLineStyle = 'dotted';
			this.selectedNodeRect = '';
			this.drawMultipleSelectModeMouseMove = this.drawMultipleSelectModeMouseMove.bind(this);
			this.multipleSelectModeMousePositionNode = null;
        }
		
		initialize() {
			this.Query = '';
            this.singleQueryForMultiple = '';
            this.src = '';
            this.tagName = '';
            this.columnCnt = 0;
            this.isEditable = false;
            this.elementHTML = '';
            this.ChromeElements = [];
            this.fullHTML = '';
            this.shortQuery = '';
			this.formChangedElements = [];
			this.formSelectedElements = [];
			this.selectedFormNode = null;
			this.clickedNode = null;
			this.selectedNodeRect = '';
		}
		
        preventClick(e) {
            if (this.isHideStateMode) {
				return;
			}
			
            e.stopImmediatePropagation();
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();

            if (this.isMultiSelectMode()) {
				if (this.multipleSelectModeMousePositionNode == null) {
					this.clickedNode = e.target;
				}
            } else if (this.isFormSelectMode()) {
				if (this.formSelectedElements.length > 0) {
					this.sendQuery('', this.constFormInputMsg);
					this.selectedFormNode = e.target;
					this.searchCanManagedElemnts(this.selectedFormNode);
					this.setStateMode('hide', false);
					this.sendSelectedElementsLength(this.formSelectedElements.length);
					this.drawMultipleElements(this.formSelectedElements, this.constFormSelectedElementsColor, this.constFormSelectedElementsLineStyle);
				}				
			}
        }
		
		formPreDraw(node) {
			if (node.id !== this.contentNode) {
				this.searchCanManagedElemnts(node);
				this.drawMultipleElements(this.formSelectedElements, 'rgba(0, 0, 250, 0.3)', 'dotted');
			}
		}
		
		searchCanManagedElemnts(node) {
			this.formSelectedElements = [];
			
			let nodeQuery = this.getCSSSelector(node);
			let preSelectedElmts = document.querySelector(nodeQuery).querySelectorAll('input, textarea, select');
			let selectedNode = null;
			let diagonalType = 'none';
			let elmtQuery = '';
			let isPassword = false;
			let objValue = '';
			
			for(var index = 0; index < preSelectedElmts.length; index++) {
				selectedNode = null;
				isPassword = false;
				objValue = '';
				elmtQuery = '';
				diagonalType = 'none';
				
				selectedNode = preSelectedElmts[index];
				
				if (!this.isElementDisplayNone(selectedNode)) {
					if (selectedNode.readOnly == 'undefined' || selectedNode.readOnly)
						continue;
					
					if (selectedNode.tagName.toLowerCase() == 'input') {
						if (selectedNode.type == 'text' || selectedNode.type == 'password' || selectedNode.type == 'email' 
						|| selectedNode.type == 'search' || selectedNode.type == 'tel' || selectedNode.type == 'number'
						|| selectedNode.type == 'url') {
							diagonalType = 'text';
							objValue = selectedNode.value;
							if (selectedNode.type == 'password') {
								isPassword = true;
							}
						} else if (selectedNode.type == 'checkbox') {
							diagonalType = 'checkBox';
							objValue = selectedNode.checked.toString();
						} else {
							continue;
						}
					} else if (selectedNode.tagName.toLowerCase() == 'textarea') {
						diagonalType = 'text';
						objValue = selectedNode.value;
					} else if (selectedNode.tagName.toLowerCase() == 'select') {
						diagonalType = 'selectList';
						objValue = selectedNode[selectedNode.selectedIndex].text;
					} else {
						continue;
					}
					
					elmtQuery = this.getCSSSelector(selectedNode);
					
					this.formSelectedElements.push({ node:selectedNode, selectorQuery:elmtQuery, diagonal
					:diagonalType, passwordType:isPassword,  value:objValue});
				}
			}
			
		}
		
		isElementDisplayNone(elmt) {
			let node = elmt;
			while (node != null) {
				if (window.getComputedStyle(node).display == 'none') {
					return true;
				} else {
					node = node.parentElement;
				}
			}
			return false;
		}
		
		searchModifiedElements() {
			let currentElmt = null;
			let currentValue = '';
			let currentElmtQuery = '';
			
			for(var elmtIndex = 0; elmtIndex < this.formSelectedElements.length; elmtIndex++) {
				let item = this.formSelectedElements[elmtIndex];
				
				currentElmt = document.querySelector(item.selectorQuery);
				currentValue = '';
				currentElmtQuery = '';
				
				if (this.responseType == 'selector') {
					currentElmtQuery = this.getDualSelector(currentElmt);
				} else {
					currentElmtQuery = this.getDualXPath(currentElmt);
				}
				
				if (item.diagonal == 'text') {
					currentValue = currentElmt.value;
				} else if (item.diagonal == 'checkBox') {
					currentValue = currentElmt.checked.toString();
				} else if (item.diagonal == 'selectList') {
					currentValue = currentElmt[currentElmt.selectedIndex].text;
				}
				
				if (item.value != currentValue) {
					let img = '';
					this.formChangedElements.push(
					{
						query: currentElmtQuery,
						shortQuery: this.shortQuery,
						tagName: currentElmt.tagName,
						diagonalType: item.diagonal,
						isEditable: true,
						isPassword: item.passwordType,
						elementHTML: currentElmt.outerHTML,
						isValid: true,
						chromeElements: this.ChromeElements,
						changedValue: currentValue
					});
					this.shortQuery = '';
					this.ChromeElements = [];
				}
			}
		}
		
		drawMultipleElements(formSelectedElements, lineColor, lineStyle) {
			this.removeOverlayElementsForMultipleSelectedObject();
			
			if (!lineColor) {
				lineColor = 'rgba(0, 0, 250, 0.7)';
			}
			if (!lineStyle) {
				lineStyle = 'dotted';
			}
			
            if (this.containerMultipleObj != null) {
                this.containerMultipleObj.innerHTML = '';
            }

            const overlayStyles = {
                background: 'transparent',
                padding: 'transparent',
                margin: 'transparent',
                border: lineColor,
            };

            for (var i = 0; i < formSelectedElements.length; i++) {
                var node = formSelectedElements[i].node;

                let drawnode = this.doc.createElement('div');
                let drawborder = this.doc.createElement('div');
                let drawpadding = this.doc.createElement('div');
                let drawcontent = this.doc.createElement('div');

                drawborder.style.borderColor = 'transparent';
                drawpadding.style.borderColor = overlayStyles.padding;
                drawcontent.style.background = overlayStyles.background;

                drawcontent.style.color = overlayStyles.border;
                drawcontent.style.textAlign = 'center';

                Object.assign(drawnode.style, {
                    borderColor: overlayStyles.margin,
                    pointerEvents: 'none',
                    position: 'absolute'
                });

                Object.assign(drawcontent.style, {
                    border: lineStyle,
                    borderWidth: 'medium'
                });

                drawnode.style.zIndex = 10000000;

                this.containerMultipleObj.appendChild(drawnode);
                drawnode.appendChild(drawborder);
                drawborder.appendChild(drawpadding);
                drawpadding.appendChild(drawcontent);

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', drawnode);
                this.boxWrap(dimensions, 'border', drawborder);
                this.boxWrap(dimensions, 'padding', drawpadding);

                Object.assign(drawcontent.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                var pos = this.getElementAbsolutePos(box.left - dimensions.marginLeft, box.top - dimensions.marginTop);

                Object.assign(drawnode.style, {
                    top: pos.y + 'px',
                    left: pos.x + 'px',
                });
            }

            if (this.containerMultipleObj != null) {
                this.doc.body.appendChild(this.containerMultipleObj);
            }
        }
		
		isExistSelectedFormNode() {
			if (this.selectedFormNode) {
				return true;
			} else {
				return false;
			}
		}
		
        scrapingQuery() {
            let node = this.clickedNode;
			this.clickedNode = null;
			
			if (node == null) {
				node = this.multipleSelectModeMousePositionNode;
			}
			
            if (!this.isActivate) {
                return;
            }
			
            if (node == null || this.isValid == false) {
                return;
            }
			
            let query = '';
            let index = -1;

            if (this.responseType == 'selector') {
                query = this.getDualSelector(node);
            } else {
                query = this.getDualXPath(node);
            }
			
            if (this.selectedElements.length > 0) {
                index = this.selectedElements.indexOf(node);
            }

            if (index == -1) {
                this.selectedElements.push(node);
                this.selectedElementsQuery.push(query);
            } else {
                this.selectedElements.splice(index, 1);
                this.selectedElementsQuery.splice(index, 1);
            }
			
            if (this.selectedElements.length == 0) {
                this.mergedQuery = '';

            } else if (this.selectedElements.length == 1) {
                this.mergedQuery = this.selectedElementsQuery[0];
            } else {
                if (this.responseType == 'selector') {
                    this.mergedQuery = this.getMergedSelectorAll(this.selectedElementsQuery);
                } else {
                    this.mergedQuery = this.getMergedXPathAll(this.selectedElementsQuery);
                }
            }

			this.sendSelectedElementsLength(this.selectedElements.length);
			
            this.drawSelectedElements(this.mergedQuery);
            this.shortQuery = this.mergedQuery;
        }

        setSelectMode(selectMode) {			
			this.selectMode = selectMode;
        }
		
		isMultiSelectMode() {
			if (this.selectMode == 'multiple') {
				return true;
			} else {
				return false;
			}
		}
		
		isFormSelectMode() {
			if (this.selectMode == 'form') {
				return true;
			} else {
				return false;
			}
		}
		
		isNormalMode() {
			if (this.selectMode == 'single') {
				return true;
			} else {
				return false;
			}
		}
		
		isExistSelectedElements() {
			return this.selectedElements.length > 0;
		}
		
        initScrapingInfo(isreset) {
            this.selectedElements = [];
            this.selectedElementsQuery = [];
            this.mergedQuery = '';
            this.clickedNode = null;
			this.isValid = false;
            this.removeOverlayElementsForMultipleSelectedTarget(true);
            this.removeOverlayElementsForMultipleSelectedObject(true);

            if (isreset) {
                const contentMultiNode = document.getElementById(this.overlayElementMultiple);
                if (!contentMultiNode) {
                    this.createOverlayElementsForMultipleSelectedTarget();
                    this.createOverlayElementsForMultipleSelectedObject();
                }
            }
        }

        getMergedSelectorAll(selectedElementsQuery) {
            var mergedArr = [];
            var tmpArr = [];
            var curArr = [];
            var mergeIndex = 0;
            var minIndex = 0;

            selectedElementsQuery.forEach(function (item) {
                if (tmpArr.length == 0) {
                    tmpArr = item.split('>');
                    mergeIndex = tmpArr.length;
                    minIndex = tmpArr.length;
                } else {
                    curArr = item.split('>');

                    let shortLength = curArr.length >= tmpArr.length ? tmpArr.length : curArr.length;
                    minIndex = 0;

                    for (var index = 0; index < shortLength; index++) {
                        if (tmpArr[index].toLowerCase() == curArr[index].toLowerCase()) {
                            if (minIndex < index) {
                                minIndex = index;
                            }
                        } else {
                            let regExp = /:nth-of-type\([0-9]*\)/;
                            if (tmpArr[index].replace(regExp, '').toLowerCase() == curArr[index].replace(regExp, '').toLowerCase()) {
                                tmpArr[index] = tmpArr[index].replace(regExp, '');
                                if (minIndex < index) {
                                    minIndex = index;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }

                if (mergeIndex > minIndex) {
                    mergeIndex = minIndex;
                }

            });

            for (var index = 0; index <= mergeIndex; index++) {
                mergedArr[index] = tmpArr[index];
            }

            return mergedArr.length > 0 ? mergedArr.join('>') : '';
        }

        getMergedXPathAll(selectedElementsQuery) {
            var mergedArr = [];
            var tmpArr = [];
            var curArr = [];
            var mergeIndex = 0;
            var minIndex = 0;

            selectedElementsQuery.forEach(function (item) {

                if (item.length > 0 && item.startsWith('/')) {
                    item = item.substring(1, item.length);
                }

                if (tmpArr.length == 0) {
                    tmpArr = item.split('/');
                    mergeIndex = tmpArr.length;
                    minIndex = tmpArr.length;
                } else {
                    curArr = item.split('/');

                    let shortLength = curArr.length >= tmpArr.length ? tmpArr.length : curArr.length;
                    minIndex = 0;

                    for (var index = 0; index < shortLength; index++) {
                        if (tmpArr[index].toLowerCase() == curArr[index].toLowerCase()) {
                            if (minIndex < index) {
                                minIndex = index;
                            }
                        } else {
                            let regExp = /\[[0-9]*\]/g;
                            if (tmpArr[index].replace(regExp, '').toLowerCase() == curArr[index].replace(regExp, '').toLowerCase()) {
                                tmpArr[index] = tmpArr[index].replace(regExp, '');
                                if (minIndex < index) {
                                    minIndex = index;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }

                if (mergeIndex > minIndex) {
                    mergeIndex = minIndex;
                }

            });

            for (var index = 0; index <= mergeIndex; index++) {
                mergedArr[index] = tmpArr[index];
            }

            return mergedArr.length > 0 ? '/' + mergedArr.join('/') : '';
        }

        drawSelectedElements(query) {
            this.removeOverlayElementsForMultipleSelectedTarget(true);
            this.removeOverlayElementsForMultipleSelectedObject(true);

            const contentMultiNode = document.getElementById(this.overlayElementMultiple);
            if (!contentMultiNode) {
                this.createOverlayElementsForMultipleSelectedTarget();
                this.createOverlayElementsForMultipleSelectedObject();
            }

            if (query != null && query.length > 0) {
                this.drawMultipleFromSelectedElements();
                this.drawMultipleFromQuery(query)
            }
        }

        drawMultipleFromQuery(query) {
            if (this.containerMultipleTarget != null) {
                this.containerMultipleTarget.innerHTML = '';
            }

            var nodes = null;
            var nodeCnt = 0;

            if (this.responseType == 'selector') {
                nodes = document.querySelectorAll(query);
                nodeCnt = nodes.length;

                for (var i = 0; i < nodeCnt; i++) {
                    var node = nodes[i];
                    this.makeDrawContainer(node, true, i);
                }
            } else {
                nodes = document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                nodeCnt = nodes.snapshotLength;

                for (var i = 0; i < nodeCnt; i++) {
                    var node = nodes.snapshotItem(i);
                    this.makeDrawContainer(node, true, i);
                }
            }

            if (this.containerMultipleTarget != null) {
                this.doc.body.appendChild(this.containerMultipleTarget);
            }
        }

        makeDrawContainer(node, displayIndex, index) {
            const overlayStyles = {
                background: 'rgba(0, 255, 140, 0.3)',
                padding: 'rgba(77, 200, 0, 0.3)',
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 0, 0, 0.5)',
            };

            let drawnode = this.doc.createElement('div');
            let drawborder = this.doc.createElement('div');
            let drawpadding = this.doc.createElement('div');
            let drawcontent = this.doc.createElement('div');

            drawborder.style.borderColor = 'transparent';
            drawpadding.style.borderColor = 'transparent';
            drawcontent.style.background = overlayStyles.background;

            drawcontent.style.color = overlayStyles.border;
            drawcontent.style.fontSize = '1rem';
            drawcontent.style.textAlign = 'center';

            if (displayIndex) {
                let displayIndexText = '[' + index + ']';
                drawcontent.innerHTML = displayIndexText.bold();
            }


            Object.assign(drawnode.style, {
                borderColor: overlayStyles.background,
                pointerEvents: 'none',
                position: 'absolute'
            });

            Object.assign(drawcontent.style, {
                border: 'solid',
                borderWidth: 'medium'
            });

            drawnode.style.zIndex = 10000000;

            this.containerMultipleTarget.appendChild(drawnode);
            drawnode.appendChild(drawborder);
            drawborder.appendChild(drawpadding);
            drawpadding.appendChild(drawcontent);

            const box = this.getNestedBoundingClientRect(node, this.win);
            const dimensions = this.getElementDimensions(node);

            this.boxWrap(dimensions, 'margin', drawnode);
            this.boxWrap(dimensions, 'padding', drawpadding);


            Object.assign(drawcontent.style, {
                height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
            });

            var pos = this.getElementAbsolutePos(box.left - dimensions.marginLeft, box.top - dimensions.marginTop);

            Object.assign(drawnode.style, {
                top: pos.y + 'px',
                left: pos.x + 'px'
            });


        }

        drawMultipleFromSelectedElements() {
            if (this.containerMultipleObj != null) {
                this.containerMultipleObj.innerHTML = '';
            }

            const overlayStyles = {
                background: 'transparent',
                padding: 'transparent',
                margin: 'transparent',
                border: 'rgba(0, 0, 250, 0.7)',
            };

            for (var i = 0; i < this.selectedElements.length; i++) {
                var node = this.selectedElements[i];

                let drawnode = this.doc.createElement('div');
                let drawborder = this.doc.createElement('div');
                let drawpadding = this.doc.createElement('div');
                let drawcontent = this.doc.createElement('div');

                drawborder.style.borderColor = 'transparent';
                drawpadding.style.borderColor = overlayStyles.padding;
                drawcontent.style.background = overlayStyles.background;

                drawcontent.style.color = overlayStyles.border;
                drawcontent.style.textAlign = 'center';

                Object.assign(drawnode.style, {
                    borderColor: overlayStyles.margin,
                    pointerEvents: 'none',
                    position: 'absolute'
                });

                Object.assign(drawcontent.style, {
                    border: 'solid',
                    borderWidth: 'medium'
                });

                drawnode.style.zIndex = 10000000;

                this.containerMultipleObj.appendChild(drawnode);
                drawnode.appendChild(drawborder);
                drawborder.appendChild(drawpadding);
                drawpadding.appendChild(drawcontent);

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', drawnode);
                this.boxWrap(dimensions, 'border', drawborder);
                this.boxWrap(dimensions, 'padding', drawpadding);

                Object.assign(drawcontent.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                var pos = this.getElementAbsolutePos(box.left - dimensions.marginLeft, box.top - dimensions.marginTop);

                Object.assign(drawnode.style, {
                    top: pos.y + 'px',
                    left: pos.x + 'px',
                });
            }

            if (this.containerMultipleObj != null) {
                this.doc.body.appendChild(this.containerMultipleObj);
            }
        }
		
        createOverlayElementsForMultipleSelectedTarget() {
            const overlayStyles = {
                padding: 'rgba(77, 200, 0, 0.3)',
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 200, 50, 0.3)',
                contentBorder: 'rgb(252, 177, 147, 0.8)'
            };

            this.containerMultipleTarget = this.doc.createElement('div');
            this.nodeMultipleTarget = this.doc.createElement('div');
            this.paddingMultipleTarget = this.doc.createElement('div');
            this.contentMultipleTarget = this.doc.createElement('div');
            this.svgMultipleTarget = this.doc.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.lineMultipleTarget = this.doc.createElementNS('http://www.w3.org/2000/svg', 'line');

            this.paddingMultipleTarget.style.borderColor = overlayStyles.padding;

            Object.assign(this.nodeMultipleTarget.style, {
                borderColor: overlayStyles.margin,
                pointerEvents: 'none',
                position: 'absolute'
            });

            this.containerMultipleTarget.id = this.overlayElementMultiple;
            this.containerMultipleTarget.style.zIndex = 10000000;
            this.nodeMultipleTarget.style.zIndex = 10000000;
            this.svgMultipleTarget.id = this.overlaySvgMultiple;

            this.containerMultipleTarget.appendChild(this.nodeMultipleTarget);
            this.nodeMultipleTarget.appendChild(this.paddingMultipleTarget);
            this.paddingMultipleTarget.appendChild(this.contentMultipleTarget);
            this.contentMultipleTarget.appendChild(this.svgMultipleTarget);
            this.svgMultipleTarget.appendChild(this.lineMultipleTarget);
        }

        removeOverlayElementsForMultipleSelectedTarget(preserve) {
			if (!preserve && this.containerMultipleTarget != null) {
					this.containerMultipleTarget.innerHTML = '';
			}
            const overlayHtml = document.getElementById(this.overlayElementMultiple);
            overlayHtml && overlayHtml.remove();
        }

        createOverlayElementsForMultipleSelectedObject() {
            const overlayStyles = {
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 200, 50, 0.3)',
            };

            this.containerMultipleObj = this.doc.createElement('div');
            this.nodeMultipleObj = this.doc.createElement('div');
            this.borderMultipleObj = this.doc.createElement('div');

            Object.assign(this.nodeMultipleObj.style, {
                borderColor: overlayStyles.margin,
                pointerEvents: 'none',
                position: 'absolute'
            });

            Object.assign(this.borderMultipleObj.style, {
                border: 'solid',
                borderwidth: 'medium',
                bordercolor: overlayStyles.border
            });

            this.containerMultipleObj.id = this.overlayElementMultiple;
            this.containerMultipleObj.style.zIndex = 10000000;
            this.nodeMultipleObj.style.zIndex = 10000000;

            this.containerMultipleObj.appendChild(this.borderMultipleObj);
            this.nodeMultipleObj.appendChild(this.borderMultipleObj);
        }

        removeOverlayElementsForMultipleSelectedObject(preserve) {
			if (!preserve && this.containerMultipleObj != null) {
					this.containerMultipleObj.innerHTML = '';
			}
            const overlayHtml = document.getElementById(this.overlayElementMultiple);
            overlayHtml && overlayHtml.remove();
        }
		
        getElementAbsolutePos(x, y) {
            var res = new Object();
            res.x = 0; res.y = 0;

            var viewportElement = document.documentElement;
            var scrollLeft = viewportElement.scrollLeft > window.scrollX ? viewportElement.scrollLeft : window.scrollX;
            var scrollTop = viewportElement.scrollTop | window.scrollY ? viewportElement.scrollTop : window.scrollY;

            res.x = x + scrollLeft;
            res.y = y + scrollTop;

            return res;
        }

        resize() {
            this.drawSelectedElements(this.mergedQuery);
        }

        sendData() {
            if (!this.isValid) {
                chrome.runtime.sendMessage(
                    { title: 'sendData', isValid: false }, null);
                return;
            }

            if (!this.Query)
                return;

			if (this.isMultiSelectMode() && this.selectedElements.length == 0) {
				this.shortQuery = '';
				return;
			}
			
			if (this.isFormSelectMode()) {
				if (this.isExistSelectedFormNode()) {				
					this.searchModifiedElements();
					let elmtBound = this.selectedFormNode.getBoundingClientRect();
					let formabsX = elmtBound.x + window.screenX
					let formabsY = elmtBound.y + window.screenY + (window.outerHeight - window.innerHeight);
					this.selectedNodeRect = JSON.stringify({x:formabsX, y:formabsY, width:elmtBound.width, height:elmtBound.height});
				}				
			}
			
            this.getFullHTML();
            this.isStartFrame = true;
            window.parent.postMessage({ from: 'child', x: this.currentScreenX, y: this.currentScreenY }, '*');
        }

        sendDataWithFrameIndex() {
            chrome.runtime.sendMessage(
                {
                    title: 'sendData',
                    query: this.Query,
                    src: window.location.origin + window.location.pathname,
                    fullSrc: window.location.href,
                    searchSrc: window.location.search,
                    singleQueryForMultiple: this.singleQueryForMultiple,
                    tagName: this.tagName,
                    isEditable: this.isEditable,
                    elementHTML: this.elementHTML,
                    columnCnt: this.columnCnt,
                    isValid: this.isValid,
                    isPassword: this.isPassword,
                    chromeElements: this.ChromeElements,
                    fullHTML: this.fullHTML,
                    shortQuery: this.shortQuery,
                    frameIndexes: this.indexArr,
                    frameTags: this.indexTagArr,
					chromeFormElements: this.formChangedElements,
					formRect: this.selectedNodeRect
                }, null);

            this.Query = '';
            this.singleQueryForMultiple = '';
            this.src = '';
            this.tagName = '';
            this.columnCnt = 0;
            this.isEditable = false;
            this.elementHTML = '';
            this.ChromeElements = [];
            this.fullHTML = '';
            this.shortQuery = '';
            this.indexArr = [];
            this.indexTagArr = [];
			this.formChangedElements = [];
			
			this.selectedFormNode = null;
			this.formSelectedElements = [];
			this.selectedNodeRect = '';
        }

        sendWake() {
            chrome.runtime.sendMessage({ title: 'wake', wake: true }, null);
        }

		setStateMode(stateModeVal, fromDesigner) {
			this.isReadOnlyStateMode = false;
			this.isHideStateMode = false;
			
			if (stateModeVal == 'readOnly') {
				this.isReadOnlyStateMode = true;
			} else if (stateModeVal == 'hide') {
				this.removeOverlay();
				this.isHideStateMode = true;
				if (fromDesigner && this.isExistSelectedFormNode() == false) {
					this.removeOverlayElementsForMultipleSelectedObject();
				}
			} else {
				this.selectedFormNode = null;
				this.isReadOnlyStateMode = false;
				this.formChangedElements = [];
				this.formSelectedElements = [];
				
				this.removeOverlay();
				this.removeOverlayElementsForMultipleSelectedTarget(false);
				this.removeOverlayElementsForMultipleSelectedObject(false);
				this.selectedElements = [];
				this.selectedElementsQuery = [];
				this.mergedQuery = '';
				
				if (this.containerMultipleTarget != null) {
					this.containerMultipleTarget.innerHTML = '';
				}
			}
		}

        sendSelectedElementsLength(len) {
			let src = window.location.origin + window.location.pathname;
			let fullSrc = window.location.href;
			let searchSrc = window.location.search;
			
            chrome.runtime.sendMessage({ title: 'sendSelectedElementsLength', length: len
			, multiSelectFullSrc: fullSrc, multiSelectSrc: src, multiSelectSearchSrc: searchSrc });
        }
		
        sendQuery(query, msg) {
            chrome.runtime.sendMessage({ title: 'sendQueryToTopScript', query: query, textMsg: msg }, null);
        }

        IsContentScriptActivate() {
            return this.isActivate;
        }

        setDesignerXPath(e) {
            this.designerXPath = e;
            this.responseType = 'xpath';
            this.isResponseMultiple = false;
        }

        setDesignerXPathMultiple(e) {
            this.designerXPath = e;
            this.responseType = 'xpath';
            this.isResponseMultiple = true;
        }

        async getXPathData(eventTarget) {
            if (eventTarget.id !== this.contentNode) {
                let XPath = '';

                if (this.isResponseMultiple) {
                    XPath = this.getDualXPathMultiple(eventTarget);
                    this.singleQueryForMultiple = this.getXPath(eventTarget);
                }
                else {
                    XPath = this.getDualXPath(eventTarget);
                }
                var currentxpath = XPath.split('/');
                var previousxpath = '';
                if (this.designerXPath.includes('/')) {
                    previousxpath = this.designerXPath.split('/');
                }

                this.Query = XPath;
                this.elementHTML = eventTarget.outerHTML;

				if (this.isFormSelectMode()) {
					this.sendQuery('', this.constFormSelectMsg);
				} else {
					this.sendQuery(XPath, '');
				}
            }
        }

        getXPath(el) {
            let nodeElem = el;
            if (nodeElem.id) {
                return `//*[@id="${nodeElem.id}"]`;
            }
            const parts = [];
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }
            return parts.length > 0 ? '/' + parts.reverse().join('/') : '';
        }

        getXPathMultiple(el) {
            let nodeElem = el;
            let accuracy = '';

            const parts = [];
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }

            let matchCnt = 0;
            let regExp = /\[[0-9]*\]/;
            for (let i = 0; i < parts.length; i++) {
                let isMatch = regExp.test(parts[i]);
                if (isMatch) {
                    parts[i] = parts[i].replace(regExp, '');
                    matchCnt++;
                }
                if (matchCnt == 2) {
                    matchCnt = 0;
                    break;
                }
            }

            let query = parts.length > 0 ? parts.reverse().join('/') : '';
            let accuracyQuery = accuracy.length > 0 ? query + accuracy : query;
            let accuracyQueryElements = document.evaluate(accuracyQuery, document.cloneNode(true), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            return accuracyQueryElements.snapshotLength > 1 ? accuracyQuery : query;
        }

        getDualXPath(el) {
            let nodeElem = el;
            let shortPath = '';
            let isShortPathFinished = false;
            let tmpShortPath = '';
            let shortPathObjCnt = 0;
            const parts = [];
            let indexCnt = 0;
            this.ChromeElements = [];

            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                if (!isShortPathFinished) {
                    shortPathObjCnt = 0;
                    if (shortPath.length > 0) {
                        tmpShortPath = prefix + nodeElem.localName + '/' + shortPath;
                    } else {
                        tmpShortPath = prefix + nodeElem.localName;
                    }

                    let idclasselemt = document.evaluate('//' + tmpShortPath, document, null, XPathResult.ANY_TYPE, null);
                    let idclassnode = null;

                    while (idclassnode = idclasselemt.iterateNext()) {
                        shortPathObjCnt++;
                        if (shortPathObjCnt > 1) {
                            break;
                        }
                    }

                    if (shortPathObjCnt == 1) {
                        shortPath = tmpShortPath;
                        let regExp = /\[[0-9]*\]/g;
                        let matchCnt = 0;
                        let matchIndex = 0;
                        let tmpObjCnt = 0;
                        let modifyShortPath = '';

                        if (regExp.test('//' + tmpShortPath))
                            matchCnt = ('//' + tmpShortPath).match(regExp).length;

                        for (var index = 0; index < matchCnt; index++) {
                            matchIndex = -1;
                            tmpObjCnt = 0;
                            let isMatch = regExp.test('//' + tmpShortPath);
                            if (isMatch) {

                                modifyShortPath = tmpShortPath.replace(regExp, function (match) {
                                    matchIndex++;
                                    return (matchIndex == index) ? "" : match;
                                });

                                let idclasselemt = document.evaluate('//' + modifyShortPath, document, null, XPathResult.ANY_TYPE, null);
                                let idclassnode = null;

                                while (idclassnode = idclasselemt.iterateNext()) {
                                    tmpObjCnt++;
                                    if (tmpObjCnt > 1) {
                                        break;
                                    }
                                }

                                if (tmpObjCnt == 1) {
                                    let findIndex = -1;
                                    for (let i in this.ChromeElements) {
                                        let item = this.ChromeElements[i];
                                        for (let j in item) {
                                            if (item[j].name == 'index') {
                                                if (item[j].isUse) {
                                                    findIndex += 1;
                                                }
                                                if (findIndex == (matchCnt - 1 - index)) {
                                                    item[j].isUse = false;
                                                }
                                            }
                                        }
                                    }

                                    tmpShortPath = modifyShortPath;
                                    index -= 1;
                                    matchCnt -= 1;
                                }
                            }
                        }
                        shortPath = tmpShortPath;
                        isShortPathFinished = true;

                        let ElementProperties = [];
                        let elementAttr = nodeElem.attributes;
                        ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });

                        for (let i = 0; i < elementAttr.length; i++) {
                            if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                                || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                                || elementAttr[i].name == 'type') {
                                ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                            }
                        }
                        this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                        indexCnt++;
                    }

                    if (shortPathObjCnt > 1) {
                        if (shortPath.length > 0) {
                            shortPath = prefix + nodeElem.localName + nth + '/' + shortPath;
                        } else {
                            shortPath = prefix + nodeElem.localName + nth;
                        }
                        let ElementProperties = [];
                        let elementAttr = nodeElem.attributes;

                        if (nth !== '') {
                            ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": true });
                        } else {
                            ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                        }

                        for (let i = 0; i < elementAttr.length; i++) {
                            if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                                || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                                || elementAttr[i].name == 'type') {
                                ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                            }
                        }
                        this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                        indexCnt++;
                    }
                } else {
                    let ElementProperties = [];
                    let elementAttr = nodeElem.attributes;
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                    for (let i = 0; i < elementAttr.length; i++) {
                        if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                            || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                            || elementAttr[i].name == 'type') {
                            ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                        }
                    }
                    this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": false });
                    indexCnt++;
                }

                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }
            shortPath = '//' + shortPath;

            if (!this.isMultiSelectMode()) {
                this.shortQuery = shortPath;
            }

            return parts.length > 0 ? '/' + parts.reverse().join('/') : '';
        }

        getDualXPathMultiple(el) {
            let nodeElem = el;
            let accuracy = '';

            let shortQuery = '';
            let shortPath = '';
            let isShortPathFinished = false;
            const parts = [];
            let indexCnt = 0;
            this.ChromeElements = [];

            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                let ElementProperties = [];
                let elementAttr = nodeElem.attributes;

                if (nth !== '') {
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": true });
                } else {
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                }

                for (let i = 0; i < elementAttr.length; i++) {
                    if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                        || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                        || elementAttr[i].name == 'type') {
                        ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                    }
                }

                this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                indexCnt++;


                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }

            let matchCnt = 0;
            let regExp = /\[[0-9]*\]/;
            for (let i = 0; i < parts.length; i++) {
                let isMatch = regExp.test(parts[i]);
                if (isMatch) {
                    parts[i] = parts[i].replace(regExp, '');
                    matchCnt++;
                }
                if (matchCnt == 2) {
                    matchCnt = 0;
                    break;
                }
            }

            let query = parts.length > 0 ? parts.reverse().join('/') : '';
            let accuracyQueryElements = document.evaluate(query, document.cloneNode(true), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            let elementCnt = accuracyQueryElements.snapshotLength;

            nodeElem = el;
            indexCnt = 0;

            let removeIndexCnt = 2;
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                if (shortPath.length > 0) {
                    if (removeIndexCnt > 0 && nth != '') {
                        shortPath = prefix + nodeElem.localName + '/' + shortPath;
                        removeIndexCnt -= 1;
                        for (let j in this.ChromeElements[(indexCnt)].data) {
                            if (this.ChromeElements[(indexCnt)].data[j].name == 'index') {
                                this.ChromeElements[(indexCnt)].data[j].isUse = false;
                            }
                        }

                    } else {
                        shortPath = prefix + nodeElem.localName + nth + '/' + shortPath;
                    }
                } else {
                    if (removeIndexCnt > 0 && nth != '') {
                        shortPath = prefix + nodeElem.localName;
                        removeIndexCnt -= 1;
                        for (let j in this.ChromeElements[(indexCnt)].data) {
                            if (this.ChromeElements[(indexCnt)].data[j].name == 'index') {
                                this.ChromeElements[(indexCnt)].data[j].isUse = false;
                            }
                        }
                    } else {
                        shortPath = prefix + nodeElem.localName + nth;
                    }
                }

                let currentCnt = document.evaluate('//' + shortPath, document.cloneNode(true), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

                if (elementCnt == currentCnt && !isShortPathFinished) {

                    let regExp = /\[[0-9]*\]/g;
                    let matchCnt = 0;
                    let matchIndex = 0;
                    let tmpObjCnt = 0;
                    let tmpShortPath = shortPath;
                    let modifyShortPath = '';

                    matchCnt = ('//' + tmpShortPath).match(regExp) == null ? 0 : ('//' + tmpShortPath).match(regExp).length;

                    for (var index = 0; index < matchCnt; index++) {
                        matchIndex = -1;
                        tmpObjCnt = 0;
                        let isMatch = regExp.test('//' + tmpShortPath);
                        if (isMatch) {
                            modifyShortPath = tmpShortPath.replace(regExp, function (match) {
                                matchIndex++;
                                return (matchIndex == index) ? "" : match;
                            });

                            tmpObjCnt = document.evaluate('//' + modifyShortPath, document.cloneNode(true), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

                            if (tmpObjCnt == elementCnt) {
                                let findIndex = -1;
                                for (let i in this.ChromeElements) {
                                    let item = this.ChromeElements[i];

                                    if (item.index > indexCnt) {
                                        continue;
                                    }

                                    for (let j in item.data) {
                                        if (item.data[j].name == 'index') {
                                            if (item.data[j].isUse) {
                                                findIndex += 1;
                                            }
                                            if (findIndex == (matchCnt - 1 - index)) {
                                                item.data[j].isUse = false;
                                            }
                                        }
                                    }
                                }

                                tmpShortPath = modifyShortPath;
                                index -= 1;
                                matchCnt -= 1;
                            }
                        }
                    }
                    if (!isShortPathFinished) {
                        shortQuery = tmpShortPath;
                        isShortPathFinished = true;
                    }
                }

                if (isShortPathFinished) {
                    for (let i in this.ChromeElements) {
                        let item = this.ChromeElements[i];

                        if (item.index == indexCnt + 1) {
                            item.isUse = false;
                            for (let j in item.data) {
                                if (item.data[j].name == 'index') {
                                    item.data[j].isuse = false;
                                }
                            }
                        }
                    }
                }

                indexCnt += 1;
                nodeElem = nodeElem.parentNode;
            }

            shortQuery = '//' + shortQuery;
            this.shortQuery = shortQuery;

            return query;
        }

        setDesignerSelector(e) {
            this.designerSelector = e;
            this.responseType = 'selector';
            this.isResponseMultiple = false;
        }

        setDesignerSelectorMultiple(e) {
            this.designerSelector = e;
            this.responseType = 'selector';
            this.isResponseMultiple = true;
        }

        async getSelectorData(eventTarget) {
            if (eventTarget.id !== this.contentNode) {
                let Selector = '';

                if (this.isResponseMultiple) {
                    Selector = this.getDualSelectorMultiple(eventTarget);
                    this.singleQueryForMultiple = this.getCSSSelector(eventTarget);
                }
                else {
                    Selector = this.getDualSelector(eventTarget);
                }

                var currentSelector = Selector.split('>');
                var previousSelector = '';
                if (this.designerSelector.includes('>')) {
                    previousSelector = this.designerSelector.split('>');
                }

                this.Query = Selector;
                this.elementHTML = eventTarget.outerHTML;

				if (this.isFormSelectMode()) {
					this.sendQuery('', this.constFormSelectMsg);
				} else {
					this.sendQuery(Selector, '');
				}
            }
        }

        getCSSSelector(el) {
            let nodeElem = el;

            if (nodeElem.id) {
                return `#${nodeElem.id}`;
            }
            const parts = [];
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `:nth-of-type(${nbOfPreviousSiblings + 1})` : '';
                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }
            return parts.length > 0 ? parts.reverse().join('>') : '';
        }

        getCSSSelectorMultiple(el) {
            let nodeElem = el;
            let accuracy = '';

            const partsmultiple = [];
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `:nth-of-type(${nbOfPreviousSiblings + 1})` : '';
                partsmultiple.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }

            let matchCnt = 0;
            let regExp = /:nth-of-type\([0-9]*\)/;
            for (let i = 0; i < partsmultiple.length; i++) {
                let isMatch = regExp.test(partsmultiple[i]);
                if (isMatch) {
                    partsmultiple[i] = partsmultiple[i].replace(regExp, '');
                    matchCnt++;
                }
                if (matchCnt == 2) {
                    matchCnt = 0;
                    break;
                }
            }

            let query = partsmultiple.length > 0 ? partsmultiple.reverse().join('>') : '';
            let accuracyQuery = accuracy.length > 0 ? query + accuracy : query;
            let accuracyQueryElements = document.querySelectorAll(accuracyQuery);

            return accuracyQueryElements.length > 1 ? accuracyQuery : query;
        }

        getDualSelector(el) {
            let nodeElem = el;
            let shortPath = '';
            let isShortPathFinished = false;
            let tmpShortPath = '';
            let shortPathObjCnt = 0;
            const parts = [];
            let indexCnt = 0;
            this.ChromeElements = [];

            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `:nth-of-type(${nbOfPreviousSiblings + 1})` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                if (!isShortPathFinished) {
                    shortPathObjCnt = 0;
                    if (shortPath.length > 0) {
                        tmpShortPath = prefix + nodeElem.localName + '>' + shortPath;
                    } else {
                        tmpShortPath = prefix + nodeElem.localName;
                    }

                    let idclasselemt = document.querySelectorAll(tmpShortPath);
                    let idclassnode = null;

                    shortPathObjCnt = idclasselemt.length;

                    if (shortPathObjCnt == 1) {
                        shortPath = tmpShortPath;
                        let regExp = /:nth-of-type\([0-9]*\)/g;
                        let matchCnt = 0;
                        let matchIndex = 0;
                        let tmpObjCnt = 0;
                        let modifyShortPath = '';

                        if (regExp.test(tmpShortPath))
                            matchCnt = (tmpShortPath).match(regExp).length;

                        for (var index = 0; index < matchCnt; index++) {
                            matchIndex = -1;
                            tmpObjCnt = 0;
                            let isMatch = regExp.test(tmpShortPath);
                            if (isMatch) {

                                modifyShortPath = tmpShortPath.replace(regExp, function (match) {
                                    matchIndex++;
                                    return (matchIndex == index) ? "" : match;
                                });

                                let idclasselemt = document.querySelectorAll(modifyShortPath);
                                let idclassnode = null;

                                tmpObjCnt = idclasselemt.length;

                                if (tmpObjCnt == 1) {
                                    let findIndex = -1;
                                    for (let i in this.ChromeElements) {
                                        let item = this.ChromeElements[i];
                                        for (let j in item) {
                                            if (item[j].name == 'index') {
                                                if (item[j].isUse) {
                                                    findIndex += 1;
                                                }
                                                if (findIndex == (matchCnt - 1 - index)) {
                                                    item[j].isUse = false;
                                                }
                                            }
                                        }
                                    }

                                    tmpShortPath = modifyShortPath;
                                    index -= 1;
                                    matchCnt -= 1;
                                }
                            }
                        }
                        shortPath = tmpShortPath;
                        isShortPathFinished = true;

                        let ElementProperties = [];
                        let elementAttr = nodeElem.attributes;
                        ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                        for (let i = 0; i < elementAttr.length; i++) {
                            if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                                || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                                || elementAttr[i].name == 'type') {
                                ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                            }
                        }
                        this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                        indexCnt++;
                    }

                    if (shortPathObjCnt > 1) {
                        if (shortPath.length > 0) {
                            shortPath = prefix + nodeElem.localName + nth + '>' + shortPath;
                        } else {
                            shortPath = prefix + nodeElem.localName + nth;
                        }

                        let ElementProperties = [];
                        let elementAttr = nodeElem.attributes;
                        if (nth !== '') {
                            ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": true });
                        } else {
                            ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                        }
                        for (let i = 0; i < elementAttr.length; i++) {
                            if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                                || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                                || elementAttr[i].name == 'type') {
                                ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                            }
                        }
                        this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                        indexCnt++;
                    }
                } else {
                    let ElementProperties = [];
                    let elementAttr = nodeElem.attributes;
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                    for (let i = 0; i < elementAttr.length; i++) {
                        if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                            || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                            || elementAttr[i].name == 'type') {
                            ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                        }
                    }
                    this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": false });
                    indexCnt++;
                }

                parts.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }

            if (!this.isMultiSelectMode()) {
                this.shortQuery = shortPath;
            }

            return parts.length > 0 ? parts.reverse().join('>') : '';
        }

        getDualSelectorMultiple(el) {
            let nodeElem = el;
            let accuracy = '';


            let shortQuery = '';
            let shortPath = '';
            let isShortPathFinished = false;
            const partsmultiple = [];
            let indexCnt = 0;
            this.ChromeElements = [];

            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `:nth-of-type(${nbOfPreviousSiblings + 1})` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                let ElementProperties = [];
                let elementAttr = nodeElem.attributes;

                if (nth !== '') {
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": true });
                } else {
                    ElementProperties.push({ "name": "index", "value": tagIndex, "isUse": false });
                }

                for (let i = 0; i < elementAttr.length; i++) {
                    if (elementAttr[i].name == 'id' || elementAttr[i].name == 'class'
                        || elementAttr[i].name == 'href' || elementAttr[i].name == 'src'
                        || elementAttr[i].name == 'type') {
                        ElementProperties.push({ "name": elementAttr[i].name, "value": elementAttr[i].value, "isUse": false });
                    }
                }

                this.ChromeElements.push({ "index": indexCnt, "tag": nodeElem.tagName, "data": ElementProperties.slice(), "isUse": true });
                indexCnt++;

                partsmultiple.push(prefix + nodeElem.localName + nth);
                nodeElem = nodeElem.parentNode;
            }

            let matchCnt = 0;
            let regExp = /:nth-of-type\([0-9]*\)/;
            for (let i = 0; i < partsmultiple.length; i++) {
                let isMatch = regExp.test(partsmultiple[i]);
                if (isMatch) {
                    partsmultiple[i] = partsmultiple[i].replace(regExp, '');
                    matchCnt++;
                }
                if (matchCnt == 2) {
                    matchCnt = 0;
                    break;
                }
            }

            let query = partsmultiple.length > 0 ? partsmultiple.reverse().join('>') : '';
            let queryElements = document.querySelectorAll(query);
            let elementCnt = queryElements.length;

            nodeElem = el;
            indexCnt = 0;

            let removeIndexCnt = 2;
            while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
                let nbOfPreviousSiblings = 0;
                let hasNextSiblings = false;
                let sibling = nodeElem.previousSibling;
                while (sibling) {
                    if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
                        nbOfPreviousSiblings++;
                    }
                    sibling = sibling.previousSibling;
                }
                sibling = nodeElem.nextSibling;
                while (sibling) {
                    if (sibling.nodeName === nodeElem.nodeName) {
                        hasNextSiblings = true;
                        break;
                    }
                    sibling = sibling.nextSibling;
                }
                const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
                const nth = nbOfPreviousSiblings || hasNextSiblings ? `:nth-of-type(${nbOfPreviousSiblings + 1})` : '';
                const tagIndex = nbOfPreviousSiblings || hasNextSiblings ? `${nbOfPreviousSiblings + 1}` : '';

                if (shortPath.length > 0) {
                    if (removeIndexCnt > 0 && nth != '') {
                        shortPath = prefix + nodeElem.localName + '>' + shortPath;
                        removeIndexCnt -= 1;
                        for (let j in this.ChromeElements[(indexCnt)].data) {
                            if (this.ChromeElements[(indexCnt)].data[j].name == 'index') {
                                this.ChromeElements[(indexCnt)].data[j].isUse = false;
                            }
                        }

                    } else {
                        shortPath = prefix + nodeElem.localName + nth + '>' + shortPath;
                    }
                } else {
                    if (removeIndexCnt > 0 && nth != '') {
                        shortPath = prefix + nodeElem.localName;
                        removeIndexCnt -= 1;
                        for (let j in this.ChromeElements[(indexCnt)].data) {
                            if (this.ChromeElements[(indexCnt)].data[j].name == 'index') {
                                this.ChromeElements[(indexCnt)].data[j].isUse = false;
                            }
                        }
                    } else {
                        shortPath = prefix + nodeElem.localName + nth;
                    }
                }

                let currentCnt = document.querySelectorAll(shortPath).length;

                if (elementCnt == currentCnt && !isShortPathFinished) {

                    let regExp = /:nth-of-type\([0-9]*\)/g;
                    let matchCnt = 0;
                    let matchIndex = 0;
                    let tmpObjCnt = 0;
                    let tmpShortPath = shortPath;
                    let modifyShortPath = '';

                    matchCnt = (tmpShortPath).match(regExp) == null ? 0 : (tmpShortPath).match(regExp).length;

                    for (var index = 0; index < matchCnt; index++) {
                        matchIndex = -1;
                        tmpObjCnt = 0;
                        let isMatch = regExp.test(tmpShortPath);
                        if (isMatch) {
                            modifyShortPath = tmpShortPath.replace(regExp, function (match) {
                                matchIndex++;
                                return (matchIndex == index) ? "" : match;
                            });

                            tmpObjCnt = document.querySelectorAll(modifyShortPath).length;

                            if (tmpObjCnt == elementCnt) {
                                let findIndex = -1;
                                for (let i in this.ChromeElements) {
                                    let item = this.ChromeElements[i];

                                    if (item.index > indexCnt) {
                                        continue;
                                    }

                                    for (let j in item.data) {
                                        if (item.data[j].name == 'index') {
                                            if (item.data[j].isUse) {
                                                findIndex += 1;
                                            }
                                            if (findIndex == (matchCnt - 1 - index)) {
                                                item.data[j].isUse = false;
                                            }
                                        }
                                    }
                                }

                                tmpShortPath = modifyShortPath;
                                index -= 1;
                                matchCnt -= 1;
                            }
                        }
                    }
                    if (!isShortPathFinished) {
                        shortQuery = tmpShortPath;
                        isShortPathFinished = true;
                    }
                }

                if (isShortPathFinished) {
                    for (let i in this.ChromeElements) {
                        let item = this.ChromeElements[i];

                        if (item.index == indexCnt + 1) {
                            item.isUse = false;
                            for (let j in item.data) {
                                if (item.data[j].name == 'index') {
                                    item.data[j].isuse = false;
                                }
                            }
                        }
                    }
                }

                indexCnt += 1;
                nodeElem = nodeElem.parentNode;
            }

            shortQuery = shortQuery;
            this.shortQuery = shortQuery;

            return query;
        }

        getFullHTML() {
            this.removeOverlay();
            this.fullHTML = document.documentElement.outerHTML;
        }

        //not used
        async loadIFrameFromBG() {
            let data = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ title: 'loadiFrame', loadiframe: 'iframe' }, function (response) {
                    resolve(response);
                });
            }).catch();

            this.isIFrame = data.isiframe;
            this.href = data.href;
            this.src = this.href;
        }

        saveIFrameToBG(isiframe, href, saveForce = false) {
            if (this.isIFrame != isiframe || this.href != href || saveForce == true) {
                chrome.runtime.sendMessage({ title: 'saveiFrame', saveiframe: isiframe, href: href });
            }
        }

        applyCustomData(key, jsonValue) {
            switch (key) {
                case 'isIFrame':
                    if (jsonValue) {
                        this.isIFrame = JSON.parse(jsonValue).isiframe;
                        this.href = JSON.parse(jsonValue).href;
                        this.src = this.href;
                    }
                    else {
                        this.isIFrame = '';
                        this.href = '';
                        this.src = '';
                    }
                    break;
                default:
                    break;
            }
        }

        getOptions() {
            this.setOptions();
        }

        setOptions(options) {
            let position = 'bottom:0;left:0';

            this.styles = `#RPA-overlayMultiple, #RPA-overlaySvgMultiple {all:unset;} #RPA-content{${position};cursor:initial!important;padding:10px;background:gray;color:white;position:fixed;font-size:14px;z-index:10000001;}`;
            this.activate();
        }

        changeOverlayBGColor() {
            const overlayStyles = {
                pause: 'rgba(119, 119, 119, 0.8)',
                resume: 'rgba(252, 177, 147, 0.8)',
                invalid: 'rgba(255, 0, 0, 0.8)'
            };

            if (this.isActivate) {
                if (this.isPause) {
                    document.removeEventListener('click', this.preventClick, true);
                    this.preventClickEnable = false;
                    this.content.style.borderColor = overlayStyles.pause;
                    this.line.setAttribute("stroke", this.content.style.borderColor);

                    let multipleContents = document.getElementsByClassName(this.contentListClassName);
                    if (multipleContents.length > 0) {
                        for (var i = 0; i < multipleContents.length; i++) {
                            multipleContents[i].style.borderColor = overlayStyles.pause;
                        }
                    }
                } else {
                    if (!this.preventClickEnable) {
                        document.addEventListener('click', this.preventClick, true);
                        this.preventClickEnable = true;
                    }

                    this.content.style.borderColor = overlayStyles.resume;

                    let multipleContents = document.getElementsByClassName(this.contentListClassName);
                    if (multipleContents.length > 0) {
                        for (var i = 0; i < multipleContents.length; i++) {
                            multipleContents[i].style.borderColor = overlayStyles.resume;
                        }
                    }

                    if (multipleContents.length == 0 && !this.isValid && (this.DiagonalType || this.DiagonalType.length > 0)) {
                        this.content.style.borderColor = overlayStyles.invalid;
                        this.line.setAttribute("stroke", this.content.style.borderColor);
                    }
					
					if (this.isMultiSelectMode() == true && !this.isValid) {
						this.content.style.borderColor = overlayStyles.invalid;
						this.line.setAttribute("stroke", this.content.style.borderColor);
					}
                }
            }
        }

        createOverlayElements() {
            const overlayStyles = {
                padding: 'rgba(77, 200, 0, 0.3)',
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 200, 50, 0.3)',
                contentBorder: 'rgb(252, 177, 147, 0.8)'
            };

            this.container = this.doc.createElement('div');
            this.node = this.doc.createElement('div');
            this.border = this.doc.createElement('div');
            this.padding = this.doc.createElement('div');
            this.content = this.doc.createElement('div');
            this.svg = this.doc.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.line = this.doc.createElementNS('http://www.w3.org/2000/svg', 'line');

            this.border.style.borderColor = overlayStyles.border;
            this.padding.style.borderColor = overlayStyles.padding;

            Object.assign(this.node.style, {
                borderColor: overlayStyles.margin,
                pointerEvents: 'none',
                position: 'fixed'
            });

            Object.assign(this.content.style, {
                border: 'solid',
                borderWidth: 'medium',
                borderColor: overlayStyles.contentBorder
            });

            this.container.id = this.overlayElement;
            this.container.style.zIndex = 10000000;
            this.node.style.zIndex = 10000000;
            this.svg.id = this.overlaySvg;

            this.container.appendChild(this.node);
            this.node.appendChild(this.border);
            this.border.appendChild(this.padding);
            this.padding.appendChild(this.content);
            this.content.appendChild(this.svg);
            this.svg.appendChild(this.line);
        }

        removeOverlay() {
            const overlayHtml = document.getElementById(this.overlayElement);
            overlayHtml && overlayHtml.remove();
        }

        setIsTable(isTable) {
            this.isTable = isTable;
        }

        setIsPause(isPause) {
            if (this.isPause != isPause) {
                this.isPause = isPause;
            }
            this.changeOverlayBGColor();
        }

        setDiagonalOption(diagonalType) {
            this.DiagonalType = diagonalType;
        }

        async loadIsPauseFromBG() {

            let data = await new Promise((resolve) => {
                chrome.runtime.sendMessage({ title: 'loadIsPause', ispause: 'pause' }, response => {
                    resolve(response);
                });
            }).catch();

            if (data) {
                inspect.setIsPause(data.message);
            }
        }

        async frameFirstDraw(e) {
			document.removeEventListener('mousemove', this.frameFirstDraw);
			document.addEventListener('mousemove', this.draw);
			
			if (this.isFormSelectMode()) {
				if (this.isHideStateMode) {
					this.removeOverlay();
					this.isValid = true;
					this.isPassword = false;
					this.drawMultipleElements(this.formSelectedElements, this.constFormSelectedElementsColor, this.constFormSelectedElementsLineStyle);
					return;
				} else {
					this.formPreDraw(e.target);
				}
			}
			
            const node = e.target;

            this.tagName = e.target.tagName;
            this.isEditable = e.target.isContentEditable;

            this.isValid = true;
            this.isPassword = false;
            this.sendWake();

			if (this.isReadOnlyStateMode && this.isExistSelectedElements() == false) {
				this.isValid = false;
			}
			
            this.removeOverlay();
            const contentNode = document.getElementById(this.contentNode);
            contentNode && contentNode.remove();

            this.createOverlayElements();

            if (node.tagName.toLowerCase() == 'iframe') {
                this.isIFrame = true;
                this.saveIFrameToBG(true, node.src);
                this.src = node.src;
            }

            if (node.id !== this.contentNode) {

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', this.node);
                this.boxWrap(dimensions, 'border', this.border);
                this.boxWrap(dimensions, 'padding', this.padding);

                Object.assign(this.content.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                Object.assign(this.node.style, {
                    top: box.top - dimensions.marginTop + 'px',
                    left: box.left - dimensions.marginLeft + 'px',
                });

                const overlayStyles = {
                    pause: 'rgba(119, 119, 119, 0.8)',
                    resume: 'rgba(252, 177, 147, 0.8)',
                    invalid: 'rgba(255, 0, 0, 0.8)'
                };

                if (this.isPause) {
                    this.content.style.borderColor = overlayStyles.pause;
                } else {
                    this.content.style.borderColor = overlayStyles.resume;
                }
                this.content.style.borderStyle = overlayStyles.solid;

                this.svg.setAttribute('id', 'svg');
                this.svg.setAttribute('height', this.content.style.height);
                this.svg.setAttribute('width', this.content.style.width);
                this.line.setAttribute('id', 'svgline');
                this.line.setAttribute('x1', '0');
                this.line.setAttribute('y1', '0');
                this.line.setAttribute('x2', '100%');
                this.line.setAttribute('y2', '100%');
                this.line.setAttribute("stroke", this.content.style.borderColor);
                this.line.setAttribute("stroke-width", "4");
                this.line.setAttribute("stroke-dasharray", "4");

                if (this.DiagonalType === 'text') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && (node.type != 'text' && node.type != 'password' && node.type != 'email' && node.type != 'search' && node.type != 'tel' && node.type != 'number' && node.type != 'url'))
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (node.tagName.toLowerCase() != 'textarea') {

                            if (!this.isPause) {
                                this.content.style.borderColor = overlayStyles.invalid;
                                this.line.setAttribute("stroke", overlayStyles.invalid);
                            }

                            this.content.style.borderStyle = overlayStyles.dash;
                            this.content.appendChild(this.svg);
                            this.svg.appendChild(this.line);
                            this.isValid = false;
                        } else {
                            this.svg.remove();
                        }
                    } else if (node.type == 'password') {
                        this.isPassword = true;
                        this.svg.remove();
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'credentialText') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && node.type != 'password')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'selectList') {
                    if ((node.tagName.toLowerCase() != 'select')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'checkBox') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && node.type != 'checkbox')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else {
                    this.svg.remove();
                }

				if (!this.isValid) {
					if (!this.isPause) {
						this.content.style.borderColor = overlayStyles.invalid;
						this.line.setAttribute("stroke", overlayStyles.invalid);
					}

					this.content.style.borderStyle = overlayStyles.dash;
					this.content.appendChild(this.svg);
					this.svg.appendChild(this.line);
				}
				
                document.body.appendChild(this.container);

                if (this.responseType == 'selector') {
                    this.getSelectorData(e.target);
                }
                else {
                    await this.getXPathData(e.target);
                }
            }
        }

        async frameFirstDrawMultiple(e) {
            document.removeEventListener('mousemove', this.frameFirstDrawMultiple);
			document.addEventListener('mousemove', this.drawMultiple);
			
            this.container.innerHTML = '';
            this.sendWake();

            this.removeOverlay();
            const contentNode = document.getElementById(this.contentNode);
            contentNode && contentNode.remove();

            this.createOverlayElements();
			this.isValid = true;
            this.isPassword = false;
            if (e.target.tagName.toLowerCase() == 'iframe') {
                this.isIFrame = true;
                this.saveIFrameToBG(true, node.src);
                this.src = node.src;
            }

            var multipleSelector = this.getCSSSelectorMultiple(e.target);

            let nodeElem = e.target;
            this.columnCnt = 0;
            let sibling = nodeElem;

            while (sibling) {
                if (sibling.previousSibling) {
                    sibling = sibling.previousSibling;
                } else {
                    break;
                }
            }

            while (sibling) {
                if (sibling.nodeName === nodeElem.nodeName) {
                    this.columnCnt += 1;
                }
                sibling = sibling.nextSibling;
            }

            var nodes = document.querySelectorAll(multipleSelector);

            const overlayStyles = {
                background: 'rgba(120, 170, 210, 0.4)',
                padding: 'rgba(77, 200, 0, 0.3)',
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 200, 50, 0.3)',
                pause: 'rgba(119, 119, 119, 0.8)',
                resume: 'rgba(252, 177, 147, 0.8)'
            };

            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];

                let drawnode = this.doc.createElement('div');
                let drawborder = this.doc.createElement('div');
                let drawpadding = this.doc.createElement('div');
                let drawcontent = this.doc.createElement('div');
                drawcontent.className = this.contentListClassName;

                drawborder.style.borderColor = overlayStyles.border;
                drawpadding.style.borderColor = overlayStyles.padding;
                drawcontent.style.background = overlayStyles.background;

                drawcontent.style.color = 'red';
                drawcontent.style.textAlign = 'center';

                if (this.isTable) {
                    drawcontent.innerText = '[' + parseInt(i / this.columnCnt) + '] [' + i % this.columnCnt + ']'
                } else {
                    drawcontent.innerText = i;
                }


                Object.assign(drawnode.style, {
                    borderColor: overlayStyles.margin,
                    pointerEvents: 'none',
                    position: 'fixed'
                });

                Object.assign(drawcontent.style, {
                    border: 'solid',
                    borderWidth: 'medium'
                });

                if (this.isPause) {
                    drawcontent.style.borderColor = overlayStyles.pause;
                } else {
                    drawcontent.style.borderColor = overlayStyles.resume;
                }

                drawnode.style.zIndex = 10000000;

                this.container.appendChild(drawnode);
                drawnode.appendChild(drawborder);
                drawborder.appendChild(drawpadding);
                drawpadding.appendChild(drawcontent);

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', drawnode);
                this.boxWrap(dimensions, 'border', drawborder);
                this.boxWrap(dimensions, 'padding', drawpadding);

                Object.assign(drawcontent.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                Object.assign(drawnode.style, {
                    top: box.top - dimensions.marginTop + 'px',
                    left: box.left - dimensions.marginLeft + 'px',
                });

            }

            this.doc.body.appendChild(this.container);

            if (this.responseType == 'selector') {
                this.getSelectorData(e.target);
            }
            else {
                await this.getXPathData(e.target);
            }
        }

        async draw(e) {
			if (this.isFormSelectMode()) {
				if (this.isHideStateMode) {
					this.removeOverlay();
					this.isValid = true;
					this.isPassword = false;
					this.drawMultipleElements(this.formSelectedElements, this.constFormSelectedElementsColor, this.constFormSelectedElementsLineStyle);
					return;
				} else {
					this.formPreDraw(e.target);
				}
			}
			
            const node = e.target;

            this.tagName = e.target.tagName;
            this.isEditable = e.target.isContentEditable;

            this.removeOverlay();
            this.isValid = true;
            this.isPassword = false;
            this.sendWake();

			if (this.isReadOnlyStateMode && this.isExistSelectedElements() == false) {
				this.isValid = false;
			}
			
            if (node.tagName.toLowerCase() == 'iframe') {
                this.isIFrame = true;
                this.saveIFrameToBG(true, node.src);
                this.src = node.src;
            }

            if (node.id !== this.contentNode) {

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', this.node);
                this.boxWrap(dimensions, 'border', this.border);
                this.boxWrap(dimensions, 'padding', this.padding);

                Object.assign(this.content.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                Object.assign(this.node.style, {
                    top: box.top - dimensions.marginTop + 'px',
                    left: box.left - dimensions.marginLeft + 'px',
                });

                const overlayStyles = {
                    pause: 'rgba(119, 119, 119, 0.8)',
                    resume: 'rgba(252, 177, 147, 0.8)',
                    invalid: 'rgba(255, 0, 0, 0.8)'
                };

                if (this.isPause) {
                    this.content.style.borderColor = overlayStyles.pause;
                } else {
                    this.content.style.borderColor = overlayStyles.resume;
                }
                this.content.style.borderStyle = overlayStyles.solid;

                this.svg.setAttribute('id', 'svg');
                this.svg.setAttribute('height', this.content.style.height);
                this.svg.setAttribute('width', this.content.style.width);
                this.line.setAttribute('id', 'svgline');
                this.line.setAttribute('x1', '0');
                this.line.setAttribute('y1', '0');
                this.line.setAttribute('x2', '100%');
                this.line.setAttribute('y2', '100%');
                this.line.setAttribute("stroke", this.content.style.borderColor);
                this.line.setAttribute("stroke-width", "4");
                this.line.setAttribute("stroke-dasharray", "4");

                if (this.DiagonalType === 'text') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && (node.type != 'text' && node.type != 'password' && node.type != 'email' && node.type != 'search' && node.type != 'tel' && node.type != 'number' && node.type != 'url'))
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (node.tagName.toLowerCase() != 'textarea') {

                            if (!this.isPause) {
                                this.content.style.borderColor = overlayStyles.invalid;
                                this.line.setAttribute("stroke", overlayStyles.invalid);
                            }

                            this.content.style.borderStyle = overlayStyles.dash;
                            this.content.appendChild(this.svg);
                            this.svg.appendChild(this.line);
                            this.isValid = false;
                        } else {
                            this.svg.remove();
                        }
                    } else if (node.type == 'password') {
                        this.isPassword = true;
                        this.svg.remove();
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'credentialText') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && node.type != 'password')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'selectList') {
                    if ((node.tagName.toLowerCase() != 'select')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else if (this.DiagonalType === 'checkBox') {
                    if ((node.tagName.toLowerCase() != 'input')
                        || (node.type != 'undefined' && node.type != 'checkbox')
                        || (node.readOnly != 'undefined' && node.readOnly)) {
                        if (!this.isPause) {
                            this.content.style.borderColor = overlayStyles.invalid;
                            this.line.setAttribute("stroke", overlayStyles.invalid);
                        }

                        this.content.style.borderStyle = overlayStyles.dash;
                        this.content.appendChild(this.svg);
                        this.svg.appendChild(this.line);
                        this.isValid = false;
                    } else {
                        this.svg.remove();
                    }
                } else {
                    this.svg.remove();
                }

				if (!this.isValid) {
					if (!this.isPause) {
						this.content.style.borderColor = overlayStyles.invalid;
						this.line.setAttribute("stroke", overlayStyles.invalid);
					}

					this.content.style.borderStyle = overlayStyles.dash;
					this.content.appendChild(this.svg);
					this.svg.appendChild(this.line);
				}
				
                document.body.appendChild(this.container);

                if (this.responseType == 'selector') {
                    this.getSelectorData(e.target);
                }
                else {
                    await this.getXPathData(e.target);
                }
            }
        }

        async drawMultiple(e) {
            this.removeOverlay();
            this.container.innerHTML = '';
            this.sendWake();
			this.isValid = true;
            this.isPassword = false;
            if (e.target.tagName.toLowerCase() == 'iframe') {
                this.isIFrame = true;
                this.saveIFrameToBG(true, node.src);
                this.src = node.src;
            }

            var multipleSelector = this.getCSSSelectorMultiple(e.target);

            let nodeElem = e.target;
            this.columnCnt = 0;
            let sibling = nodeElem;

            while (sibling) {
                if (sibling.previousSibling) {
                    sibling = sibling.previousSibling;
                } else {
                    break;
                }
            }

            while (sibling) {
                if (sibling.nodeName === nodeElem.nodeName) {
                    this.columnCnt += 1;
                }
                sibling = sibling.nextSibling;
            }

            var nodes = document.querySelectorAll(multipleSelector);

            const overlayStyles = {
                background: 'rgba(120, 170, 210, 0.4)',
                padding: 'rgba(77, 200, 0, 0.3)',
                margin: 'rgba(255, 155, 0, 0.3)',
                border: 'rgba(255, 200, 50, 0.3)',
                pause: 'rgba(119, 119, 119, 0.8)',
                resume: 'rgba(252, 177, 147, 0.8)'
            };

            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];

                let drawnode = this.doc.createElement('div');
                let drawborder = this.doc.createElement('div');
                let drawpadding = this.doc.createElement('div');
                let drawcontent = this.doc.createElement('div');
                drawcontent.className = this.contentListClassName;

                drawborder.style.borderColor = overlayStyles.border;
                drawpadding.style.borderColor = overlayStyles.padding;
                drawcontent.style.background = overlayStyles.background;

                drawcontent.style.color = 'red';
                drawcontent.style.textAlign = 'center';

                if (this.isTable) {
                    drawcontent.innerText = '[' + parseInt(i / this.columnCnt) + '] [' + i % this.columnCnt + ']'
                } else {
                    drawcontent.innerText = i;
                }


                Object.assign(drawnode.style, {
                    borderColor: overlayStyles.margin,
                    pointerEvents: 'none',
                    position: 'fixed'
                });

                Object.assign(drawcontent.style, {
                    border: 'solid',
                    borderWidth: 'medium'
                });

                if (this.isPause) {
                    drawcontent.style.borderColor = overlayStyles.pause;
                } else {
                    drawcontent.style.borderColor = overlayStyles.resume;
                }

                drawnode.style.zIndex = 10000000;

                this.container.appendChild(drawnode);
                drawnode.appendChild(drawborder);
                drawborder.appendChild(drawpadding);
                drawpadding.appendChild(drawcontent);

                const box = this.getNestedBoundingClientRect(node, this.win);
                const dimensions = this.getElementDimensions(node);

                this.boxWrap(dimensions, 'margin', drawnode);
                this.boxWrap(dimensions, 'border', drawborder);
                this.boxWrap(dimensions, 'padding', drawpadding);

                Object.assign(drawcontent.style, {
                    height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
                    width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
                });

                Object.assign(drawnode.style, {
                    top: box.top - dimensions.marginTop + 'px',
                    left: box.left - dimensions.marginLeft + 'px',
                });

            }

            this.doc.body.appendChild(this.container);

            if (this.responseType == 'selector') {
                this.getSelectorData(e.target);
            }
            else {
                await this.getXPathData(e.target);
            }
        }

		drawMultipleSelectModeMouseMove(e) {
			this.multipleSelectModeMousePositionNode = e.target;
			if (this.mergedQuery)
				this.drawSelectedElements(this.mergedQuery);
		}
		
        calcFrameIndex(event) {
            var data = event.data;
            var ratio = window.devicePixelRatio;

            if (data.from && data.from == 'child') {
                if (document.location.ancestorOrigins.length != 0) {
                    window.parent.postMessage({ from: 'child', x: data.x, y: data.y }, '*')
                } else {
                    var clientX = data.x - ((window.outerWidth - window.innerWidth * ratio) + window.screenX);
                    var clientY = data.y - ((window.outerHeight - window.innerHeight * ratio) + window.screenY);

                    clientX = clientX / ratio;
                    clientY = clientY / ratio;

                    if (window.outerWidth - window.innerWidth > 0) {
                        clientX -= 8;
                        clientY -= 8;
                    }

                    var iframeEle = document.elementFromPoint(clientX, clientY);
                    var iframeEleRect = iframeEle.getBoundingClientRect();

                    this.indexArr = [];
                    if (data.list) {
                        this.indexArr = data.list;
                    }

                    this.indexTagArr = [];
                    if (data.tags) {
                        this.indexTagArr = data.tags;
                    }

                    var index = -1;

                    var firstArr = Array.prototype.slice.call(document.getElementsByTagName("iframe"), 0);
                    var secondArr = Array.prototype.slice.call(document.getElementsByTagName("frame"), 0);

                    var frames = firstArr.concat(secondArr);

                    for (var i = 0; i < window.frames.length; i++) {
                        if (iframeEle == frames[i]) {
                            if (i <= (firstArr.length - 1)) {
                                this.indexTagArr.push('iframe');
                                this.indexArr.push(i);
                            }
                            else {
                                this.indexTagArr.push('frame');
                                this.indexArr.push(i - (firstArr.length));
                            }

                            break;
                        }
                    }
                    iframeEle.contentWindow.postMessage({ from: 'parent', list: this.indexArr, tags: this.indexTagArr, x: clientX - iframeEleRect.x, y: clientY - iframeEleRect.y }, '*');
                }
            } else if (data.from && data.from == 'parent') {
                if (this.isStartFrame) {
                    if (data.list) {
                        this.indexArr = data.list;
                    }
                    if (data.tags) {
                        this.indexTagArr = data.tags;
                    }
                    this.isStartFrame = false;
                    this.sendDataWithFrameIndex();

                } else {
                    var clientX = data.x;
                    var clientY = data.y;

                    var iframeEle = document.elementFromPoint(clientX, clientY);
                    var iframeEleRect = iframeEle.getBoundingClientRect();

                    this.indexArr = [];
                    if (data.list) {
                        this.indexArr = data.list;
                    }

                    this.indexTagArr = [];
                    if (data.tags) {
                        this.indexTagArr = data.tags;
                    }

                    var index = -1;

                    var firstArr = Array.prototype.slice.call(document.getElementsByTagName("iframe"), 0);
                    var secondArr = Array.prototype.slice.call(document.getElementsByTagName("frame"), 0);

                    var frames = firstArr.concat(secondArr);

                    for (var i = 0; i < window.frames.length; i++) {
                        if (iframeEle == frames[i]) {
                            if (i <= (firstArr.length - 1)) {
                                this.indexTagArr.push('iframe');
                                this.indexArr.push(i);
                            }
                            else {
                                this.indexTagArr.push('frame');
                                this.indexArr.push(i - (firstArr.length));
                            }

                            break;
                        }
                    }
                    iframeEle.contentWindow.postMessage({ from: 'parent', list: this.indexArr, tags: this.indexTagArr, x: clientX - iframeEleRect.x, y: clientY - iframeEleRect.y }, '*');
                }
            }
        }

        saveMousePosition(e) {
            this.saveMousePositionEnable = true;
            this.currentScreenX = e.screenX;
            this.currentScreenY = e.screenY;
        }

        monitorState(e) {
            if (!this.isActivate) {
                this.isIFrame = true;
                this.saveIFrameToBG(true, document.location.origin + document.location.pathname, true);
                this.src = document.location.origin + document.location.pathname;
                this.isActivate = true;
                this.isSleepMode = false;
                document.removeEventListener('mousemove', this.monitorState);
                inspect.sendWake();
            }
        }

        setSleepMode() {
            if (!this.isSleepMode && !this.isActivate) {
                document.addEventListener('mousemove', this.monitorState);
                this.isSleepMode = true;
            }
        }

        activate() {
            try {
                this.loadIsPauseFromBG();

				if (this.isFormSelectMode() && this.isHideStateMode && this.isExistSelectedFormNode() == false) {
					return;
				}
				
                this.doc = document;

                const contentNode = document.getElementById(this.contentNode);
                if (!contentNode) {
                    this.createOverlayElements();
                }

                const contentMultiNode = document.getElementById(this.overlayElementMultiple);
                if (!contentMultiNode) {
                    this.createOverlayElementsForMultipleSelectedTarget();
                    this.createOverlayElementsForMultipleSelectedObject();
                }

                this.isActivate = true;
                this.isSleepMode = false;

                if (!document.getElementById(this.cssNode)) {
                    const styles = document.createElement('style');
                    styles.innerText = this.styles;
                    styles.id = this.cssNode;
                    document.getElementsByTagName('head')[0].appendChild(styles);
                }

                if (!this.preventClickEnable) {
                    document.addEventListener('click', this.preventClick, true);
                    this.preventClickEnable = true;
                }

                if (!this.saveMousePositionEnable)
                    document.addEventListener('mousemove', this.saveMousePosition);

				if (this.isResponseMultiple) {
					document.addEventListener('mousemove', this.frameFirstDrawMultiple);
                } else {
					document.addEventListener('mousemove', this.frameFirstDraw);
                }
				
				if (this.isMultiSelectMode()) {
					document.addEventListener('mousemove', this.drawMultipleSelectModeMouseMove);
				}
            }
            catch {
            }
        }

        deactivate(maintainSelectedElmts) {
            document.removeEventListener('click', this.preventClick, true);
            this.preventClickEnable = false;
            document.removeEventListener('mousemove', this.monitorState);

            const cssNode = document.getElementById(this.cssNode);
            cssNode && cssNode.remove();
            this.isActivate = false;
            this.isSleepMode = false;
            this.removeOverlay();

            const contentNode = document.getElementById(this.contentNode);
            contentNode && contentNode.remove();

            if (this.isResponseMultiple) {
				document.removeEventListener('mousemove', this.drawMultiple);
				document.removeEventListener('mousemove', this.frameFirstDrawMultiple);
            } else {
				document.removeEventListener('mousemove', this.draw);
				document.removeEventListener('mousemove', this.frameFirstDraw);
            }

			if (this.isMultiSelectMode()) {
					document.removeEventListener('mousemove', this.drawMultipleSelectModeMouseMove);
			}
			
			if (!maintainSelectedElmts) {
				this.initScrapingInfo(false);
			}
        }

        windowUnLoad() {
            document.removeEventListener('mousemove', this.saveMousePosition);
            this.saveMousePositionEnable = false;
        }

        getElementDimensions(domElement) {
            const calculatedStyle = window.getComputedStyle(domElement);
            return {
                borderLeft: +calculatedStyle.borderLeftWidth.match(/[0-9]*/)[0],
                borderRight: +calculatedStyle.borderRightWidth.match(/[0-9]*/)[0],
                borderTop: +calculatedStyle.borderTopWidth.match(/[0-9]*/)[0],
                borderBottom: +calculatedStyle.borderBottomWidth.match(/[0-9]*/)[0],
                marginLeft: +calculatedStyle.marginLeft.match(/[0-9]*/)[0],
                marginRight: +calculatedStyle.marginRight.match(/[0-9]*/)[0],
                marginTop: +calculatedStyle.marginTop.match(/[0-9]*/)[0],
                marginBottom: +calculatedStyle.marginBottom.match(/[0-9]*/)[0],
                paddingLeft: +calculatedStyle.paddingLeft.match(/[0-9]*/)[0],
                paddingRight: +calculatedStyle.paddingRight.match(/[0-9]*/)[0],
                paddingTop: +calculatedStyle.paddingTop.match(/[0-9]*/)[0],
                paddingBottom: +calculatedStyle.paddingBottom.match(/[0-9]*/)[0]
            };
        }

        getOwnerWindow(node) {
            if (!node.ownerDocument) { return null; }
            return node.ownerDocument.defaultView;
        }

        getOwnerIframe(node) {
            const nodeWindow = this.getOwnerWindow(node);
            if (nodeWindow) {
                return nodeWindow.frameElement;
            }
            return null;
        }

        getBoundingClientRectWithBorderOffset(node) {
            const dimensions = this.getElementDimensions(node);
            return this.mergeRectOffsets([
                node.getBoundingClientRect(),
                {
                    top: dimensions.borderTop,
                    left: dimensions.borderLeft,
                    bottom: dimensions.borderBottom,
                    right: dimensions.borderRight,
                    width: 0,
                    height: 0
                }
            ]);
        }

        mergeRectOffsets(rects) {
            return rects.reduce((previousRect, rect) => {
                if (previousRect === null) { return rect; }
                return {
                    top: previousRect.top + rect.top,
                    left: previousRect.left + rect.left,
                    width: previousRect.width,
                    height: previousRect.height,
                    bottom: previousRect.bottom + rect.bottom,
                    right: previousRect.right + rect.right
                };
            });
        }

        getNestedBoundingClientRect(node, boundaryWindow) {
            return node.getBoundingClientRect();
        }

        boxWrap(dimensions, parameter, node) {
            Object.assign(node.style, {
                borderTopWidth: dimensions[parameter + 'Top'] + 'px',
                borderLeftWidth: dimensions[parameter + 'Left'] + 'px',
                borderRightWidth: dimensions[parameter + 'Right'] + 'px',
                borderBottomWidth: dimensions[parameter + 'Bottom'] + 'px',
                borderStyle: 'solid'
            });
        }
    }

    const inspect = new Inspector();

    window.addEventListener('resize', inspect.resize);

    function onWindowLoad() {
        document.addEventListener('mousemove', this.saveMousePosition);
    }

    window.onload = onWindowLoad;
    window.onunload = onWindowUnLoad;

    function onWindowUnLoad() {
        inspect.windowUnLoad();
    }

    window.addEventListener("message", inspect.calcFrameIndex, false);

    chrome.runtime.onMessage.addListener(request => {
        if (typeof request.xpath != 'undefined') {
            return inspect.setDesignerXPath(request.xpath);
        } else if (typeof request.xpathMultiple != 'undefined') {
            if (typeof request.isTable != 'undefined') {
                inspect.setIsTable(request.isTable);
            } else {
                inspect.setIsTable(false);
            }
            return inspect.setDesignerXPathMultiple(request.xpathMultiple);
        } else if (typeof request.selector != 'undefined') {
            return inspect.setDesignerSelector(request.selector);
        } else if (typeof request.selectorMultiple != 'undefined') {
            if (typeof request.isTable != 'undefined') {
                inspect.setIsTable(request.isTable);
            } else {
                inspect.setIsTable(false);
            }
            return inspect.setDesignerSelectorMultiple(request.selectorMultiple);
        } else if (typeof request.isPause != 'undefined') {
            return inspect.setIsPause(request.isPause);
        } else if (typeof request.query != 'undefined') {
            return;
        } else if (typeof request.diagonalType != 'undefined') {
            return inspect.setDiagonalOption(request.diagonalType);
        }

        if (typeof request.selectMode != 'undefined') {
            inspect.setSelectMode(request.selectMode);
        }

		if (typeof request.stateMode != 'undefined') {
            inspect.setStateMode(request.stateMode, false);
			if (request.stateMode == 'hide' && inspect.isExistSelectedFormNode() == false
			&& request.multiSelectFullSrc != document.location.href) {
				inspect.deactivate();
			}
        }

        if (request.title == 'notifyCustomKvpData') {
            inspect.applyCustomData(request.key, request.jsonValue);
        }

        if (request.action === 'activate') {
            
            if (request.href == '' && document.location.ancestorOrigins.length == 0) {
				if (inspect.isMultiSelectMode() == true && inspect.isExistSelectedElements() == true) {
					inspect.deactivate(true);
					return inspect.setSleepMode();
				}  else if (inspect.isFormSelectMode() == true && inspect.isExistSelectedFormNode() == true) {
					inspect.deactivate(true);
					return inspect.setSleepMode();
				}
                inspect.deactivate(false);
                return inspect.setSleepMode();
            } else if (document.location.ancestorOrigins.length == 0) {
                return inspect.saveIFrameToBG(false, '', true);
            } else if (request.href === (document.location.origin + document.location.pathname) && document.location.ancestorOrigins.length > 0) {
                return inspect.getOptions();
            } else {
				if (inspect.isMultiSelectMode() == true && inspect.isExistSelectedElements() == true) {
					inspect.deactivate(true);
					return inspect.setSleepMode();
				}  else if (inspect.isFormSelectMode() == true && inspect.isExistSelectedFormNode() == true) {
					inspect.deactivate(true);
					return inspect.setSleepMode();
				}
                inspect.deactivate(false);
                return inspect.setSleepMode();
            }
        } else if (request.action === 'getData') {
			if (inspect.isNormalMode() == true) {
				if (inspect.IsContentScriptActivate()) {
					return inspect.sendData();
				}
			} else {
				if (inspect.isMultiSelectMode() == true && inspect.isExistSelectedElements() == true) {
					return inspect.sendData();
				} else if (inspect.isFormSelectMode() == true && inspect.isExistSelectedFormNode() == true) {
					return inspect.sendData();
				}
			}
        } else if (request.action === 'sleep') {
			if (inspect.isMultiSelectMode() == true && inspect.isExistSelectedElements() == true) {
				inspect.deactivate(true);
				return inspect.setSleepMode();
			}  else if (inspect.isFormSelectMode() == true && inspect.isExistSelectedFormNode() == true) {
				inspect.deactivate(true);
				return inspect.setSleepMode();
			}
            inspect.deactivate(false);
            return inspect.setSleepMode();
        } else if (request.action === 'initialize') {
            return inspect.initialize();
        }  else if (request.action === 'deactivate') {
            return inspect.deactivate(false);
        }

		if (document.location.ancestorOrigins.length > 0) {
			if (request.action === 'multiSelectAction') {
				if (request.init) {
						inspect.initScrapingInfo(true);
						inspect.removeOverlay();
				} else {
					if (request.href === (document.location.origin + document.location.pathname)) {
						inspect.scrapingQuery();
					}
				}
			}
		}
		
        return true;
    });

    return true;
})();