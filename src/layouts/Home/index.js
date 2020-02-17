
import React, { Component } from 'react';
import _ from 'lodash';

import DropDownMenu from '../../components/DropDownMenu/index.js';
import './style.css';

import docWithLobsSegments from '../../assets/json/docWithLobsSegments.json';
import metricsWithDocuments from '../../assets/json/metricsWithDocuments.json';
import bpiFlowsList from '../../assets/json/BPIFlowsList.json';
import docList from '../../assets/json/docList.json';

import DetailForm from '../../components/DetailForm/index.js';

class Home extends Component {
	constructor(props) {
		super(props);
	
		this.options = {
		  defaultSortName: 'moduleEN',  // default sort column name
		  defaultSortOrder: 'desc',  // default sort order
		  onRowClick: this.onRowClick,
		};

		this.state = {
			docList,
			docWithLobsSegments,
			metricsWithDocuments,
			bpiFlowsList,
			data: [],
			selectedData: {},
			showModal: false,
			searchInput: '',
			pageNumber: 1,
			filter: [
				{
					placeholder: 'LOB',
					value: '',
					valueList: [],
					list: [],
				},
				{
					placeholder: 'Segment',
					value: '',
					valueList: [],
					list: [],
				},
				{
					placeholder: 'BPI Flow',
					value: '',
					valueList: [],
					list: [],
				},
				{
					placeholder: 'KPI',
					value: '',
					valueList: [],
					list: [],
				},
				{
					placeholder: 'Duration',
					value: '',
					valueList: [],
					list: [],
				},
			],
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let metricsData = [], docData = [];
		const { docList, docWithLobsSegments, metricsWithDocuments, bpiFlowsList } = prevState;
		const filter = prevState.filter.slice();
		const searchInput = prevState.searchInput;
		if (docWithLobsSegments.length > 0) {
			filter[0].list = docWithLobsSegments.map(item => item.lob);
		}
		if (docList.length > 0) {
			filter[4].list = _.sortBy(_.uniq(docList.map(item => item.duration)));
		}
		if (docList.length > 0 && metricsWithDocuments.length > 0) {
			metricsData = docList.map(docItem => {
				let kpi = [];
				if (metricsWithDocuments.length > 0) {
					metricsWithDocuments.forEach(metricsWithDocument => {
						metricsWithDocument.subs.forEach(sub => {
							if (sub.docID === docItem.docID) {
								kpi.push(metricsWithDocument.metricName);
							}
						});
					});
				}
				return {
					...docItem,
					kpi,
				};
			});
			filter[3].list = _.sortBy(_.uniq(metricsWithDocuments.map(metricsWithDocument => metricsWithDocument.metricName)));
		}
		if (docList.length > 0 && bpiFlowsList.length > 0) {
			filter[2].list = _.sortBy(_.uniq(bpiFlowsList.map(bpiFlowList => bpiFlowList.profileName)));
		}
		if (docList.length > 0 && docWithLobsSegments.length > 0) {
			const tData = metricsData.length > 0 ? metricsData : docList;
			docData = tData.map(docItem => {
				let departments = '', departmentsList = [];
				if (docWithLobsSegments.length > 0) {
					docWithLobsSegments.forEach(docWithLobsSegment => {
						docWithLobsSegment.subs.forEach(sub => {
							sub.subs.forEach(item => {
								if (item.docID === docItem.docID) {
									departments = departments === '' ? docWithLobsSegment.lob + ' - ' + sub.dept_name : departments + ', ' + docWithLobsSegment.lob + ' - ' + sub.dept_name;
									departmentsList.push(docWithLobsSegment.lob + ' - ' + sub.dept_name + ' - ' + sub.segment);
								}
							})
						})
					})
				}
				return {
					...docItem,
					departments,
					departmentsList,
				};
			});
			if (docWithLobsSegments.length > 0) {
				filter[1].list = [];
				if (filter[0].value === '') {
					docWithLobsSegments.forEach(docWithLobsSegment => {
						docWithLobsSegment.subs.forEach(sub => filter[1].list.push(docWithLobsSegment.lob + ' - ' + sub.dept_name + ' - ' + sub.segment));
					});
				} else {
					docWithLobsSegments.forEach(docWithLobsSegment => {
						if (_.findIndex(filter[0].valueList, item => item === docWithLobsSegment.lob) > -1) {
							docWithLobsSegment.subs.forEach(sub => filter[1].list.push(docWithLobsSegment.lob + ' - ' + sub.dept_name + ' - ' + sub.segment));
						}
					});
				}
			}
		}
		let data = docData.length > 0 ? docData : metricsData;
		_.remove(data, item => {
			let flag = false;
			if (filter[0].valueList.length > 0) {
				filter[0].valueList.forEach(value => {
					docWithLobsSegments.forEach(docWithLobsSegment => {
						if (docWithLobsSegment.lob === value) {
							docWithLobsSegment.subs.forEach(sub => {
								sub.subs.forEach(itemSub => {
									if (itemSub.docID === item.docID) {
										flag = true;
									}
								});
							});
						}
					});
				});
				return !flag;
			} else {
				return flag;
			}
		});
		_.remove(data, item => {
			let flag = false;
			if (filter[1].valueList.length > 0) {
				filter[1].valueList.forEach(value => {
					docWithLobsSegments.forEach(docWithLobsSegment => {
						docWithLobsSegment.subs.forEach(sub => {
							if (value === (docWithLobsSegment.lob + ' - ' + sub.dept_name + ' - ' + sub.segment)) {
								sub.subs.forEach(itemSub => {
									if (itemSub.docID === item.docID) {
										flag = true;
									}
								});
							}
						});
					});
				});
				return !flag;
			} else {
				return flag;
			}
		});
		_.remove(data, item => {
			let flag = false;
			if (filter[3].valueList.length > 0) {
				filter[3].valueList.forEach(value => {
					metricsWithDocuments.forEach(metricsWithDocument => {
						if (value === metricsWithDocument.metricName) {
							metricsWithDocument.subs.forEach(sub => {
								if (sub.docID === item.docID) {
									flag = true;
								}
							});
						}
					});
				});
				return !flag;
			} else {
				return flag;
			}
		});
		_.remove(data, item => {
			let flag = false;
			if (filter[4].valueList.length > 0) {
				filter[4].valueList.forEach(value => {
					if (parseInt(value) === parseInt(item.duration)) {
						flag = true;
					}
				});
				return !flag;
			} else {
				return flag;
			}
		});
		if (searchInput !== '') {
			_.remove(data, item => !item.descriptionEN.includes(searchInput))
		}
		return {
			docList,
			docWithLobsSegments,
			metricsWithDocuments,
			data: _.sortBy(data, item => item.moduleEN.toLowerCase()),
			filter,
		};
	}

	onRowClick = data => this.setState({ showModal: true, selectedData: data });

	setFilter = filter => this.setState({ filter });

	closeModal = () => this.setState({ showModal: false });

	searchInput = event => this.setState({ searchInput: event.target.value });

	indicatorRender = (color, title) => (
		<div className="info-indicator" style={{ display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
			<div className={`round ${color}`} style={{ marginRight: '4px' }}><i className='info fa fa-info' /></div><span>{title}</span>
		</div>
	);

	paginationRender = () => {
		const { data, pageNumber } = this.state;
		let pagination = [];
		for(let i = 0; i < (data.length / 10); i++) {
			pagination.push(
				<div
					key={i}
					className={`pagination-field${(i + 1) === pageNumber ? ' active' : ''}`}
					onClick={() => this.setState({ pageNumber: i + 1 })}
				>
					{i + 1}
				</div>
			);
		}
		return <div className="pagination-container">{pagination}</div>
	}

	render() {
		const {
			data,
			filter,
			pageNumber,
			selectedData,
			showModal,
		} = this.state;
		return (
			<div id="home" style={{ padding: '1rem' }}>
				<DetailForm
					showModal={showModal}
					data={selectedData}
					closeModal={this.closeModal}
				/>
				<div className="title">Search a document</div>
				<div className="filter">
					<div style={{ display: 'flex' }}>
						{filter.map((item, index) => (
							<DropDownMenu
								key={index}
								id={index}
								filter={filter}
								setFilter={this.setFilter}
							/>))}

						<div className="search-key-container">
							<input className="search-key" onChange={this.searchInput}/>
						</div>

						<div className="btn search-btn"><i className="fa fa-search" /></div>
					</div>
				</div>
				<div style={{ display: 'flex', marginBottom: '8px' }}>
					{this.indicatorRender('', 'Unassigned')}
					{this.indicatorRender('yellow ', 'Assigned')}
					{this.indicatorRender('red ', 'Past due')}
					{this.indicatorRender('green ', 'Completed')}
				</div>
				<div className="react-bs-table-container">
					<div className="react-bs-table react-bs-table-bordered" style={{ height: '100%' }}>
						<div className="react-bs-container-header table-header-wrapper">
							<table className="table table-hover table-bordered">
								<colgroup>
									<col style={{ width: '20%', minWidth: '20%' }} />
									<col style={{ width: '150px', minWidth: '150px' }} />
									<col style={{ width: '150px', minWidth: '150px' }} />
									<col style={{ width: '80px', minWidth: '80px' }} />
									<col />
									<col style={{ width: '180px', minWidth: '180px' }} />
									<col style={{ width: '140px', minWidth: '140px' }} />
								</colgroup>
								<thead>
									<tr>
										<th className="sort-column" title="Topic" data-field="moduleEN" style={{ textAlign: 'left' }}>
											Topic<span className="fa fa-sort-desc" style={{ margin: '10px 5px' }}></span><div></div>
										</th>
										<th title="Rating" data-field="countRatings" style={{ textAlign: 'left' }}>
											Rating<div></div>
										</th>
										<th title="Training Type" data-field="trainingType" style={{ textAlign: 'left' }}>
											Training Type<div></div>
										</th>
										<th title="KPI" data-field="kpiArray" style={{ textAlign: 'left' }}>
											KPI<div></div>
										</th>
										<th title="Departments" data-field="departments" style={{ textAlign: 'left' }}>
											Departments<div></div>
										</th>
										<th title="Duration (minutes)" data-field="duration" style={{ textAlign: 'left' }}>
											Duration (minutes)<div></div>
										</th>
										<th title="Last Updated" data-field="lastUpdated" style={{ textAlign: 'left' }}>
											Last Updated<div></div>
										</th>
									</tr>
								</thead>
							</table>
						</div>
						<div className="react-bs-container-body" style={{ height: '100%' }}>
							<table className="table table-striped table-bordered table-hover">
								<colgroup>
									<col style={{ width: '20%', minWidth: '20%' }} />
									<col style={{ width: '150px', minWidth: '150px' }} />
									<col style={{ width: '150px', minWidth: '150px' }} />
									<col style={{ width: '80px', minWidth: '80px' }} />
									<col />
									<col style={{ width: '180px', minWidth: '180px' }} />
									<col style={{ width: '140px', minWidth: '140px' }} />
								</colgroup>
								<tbody>
									{data.slice((pageNumber - 1) * 10, pageNumber * 10).map((item, index) => (
										<tr key={index} onClick={() => this.onRowClick(item)}>
											<td tabIndex="1" style={{ textAlign: 'left' }}>
												<div className="info-indicator" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'pre-wrap' }}>
													{item.assignment === 0 && <div className="round" style={{ marginRight: '4px' }}><i className="info fa fa-info"></i></div>}
													{item.assignment === 1 && <div className="round yellow" style={{ marginRight: '4px' }}><i className="info fa fa-info"></i></div>}
													{item.assignment === 2 && <div className="round red" style={{ marginRight: '4px' }}><i className="info fa fa-info"></i></div>}
													{item.assignment === 3 && <div className="round green" style={{ marginRight: '4px' }}><i className="info fa fa-info"></i></div>}
													<span style={{ width: 'calc(100% - 32px)' }}>{item.moduleEN}</span>
												</div>
											</td>
											<td tabIndex="2" style={{ textAlign: 'left' }}>
												<div className="dis-flex">
													<i className={`fa fa-star ${item.avgRatings >= 1 ? 'active' : ''}`}></i>
													<i className={`fa fa-star ${item.avgRatings >= 2 ? 'active' : ''}`}></i>
													<i className={`fa fa-star ${item.avgRatings >= 3 ? 'active' : ''}`}></i>
													<i className={`fa fa-star ${item.avgRatings >= 4 ? 'active' : ''}`}></i>
													<i className={`fa fa-star ${item.avgRatings >= 5 ? 'active' : ''}`}></i>
													({item.countRatings})
												</div>
											</td>
											<td tabIndex="3" style={{ textAlign: 'left' }}>
												<div className="dis-flex">
													{item.trainingType}{item.sideBySide === '1' && <i className="fa fa-user-friends"></i>}
												</div>
											</td>
											<td tabIndex="4" style={{ textAlign: 'left' }}>
												<div className="info-indicator dis-flex">
													<div className="round text-white" style={{ marginRight: '4px' }}>{item.kpi.length}</div>
												</div>
											</td>
											<td tabIndex="5" style={{ textAlign: 'left' }}>
												<div style={{ textAlign: 'center', width: '100%', whiteSpace: 'pre-wrap' }}>{item.departments}</div>
											</td>
											<td tabIndex="6" style={{ textAlign: 'left' }}>
												<div className="dis-flex">{item.duration}</div>
											</td>
											<td tabIndex="7" style={{ textAlign: 'left' }}>
												<div className="dis-flex">{item.lastUpdated}</div>
											</td>
										</tr>)
									)}
								</tbody>
							</table>
						</div>
					</div>
					{this.paginationRender()}
				</div>
			</div>
		);
	}
}

export default Home;
