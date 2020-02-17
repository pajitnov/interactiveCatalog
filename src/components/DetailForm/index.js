
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Modal } from 'react-bootstrap';

import './style.css';

class DetailForm extends Component {
    constructor(props) {
		super(props);

        this.state = {
            mode: 'detail',
        }
    }

    clickAssign = () => this.setState({ mode: 'assign' });

    clickConfirm = () => {}

    closeModal = () => {
        this.props.closeModal();
        this.setState({ mode: 'detail' });
    }

    cancelModal = () => this.setState({ mode: 'detail' });

    render() {
        const { data, showModal } = this.props;
        const { mode } = this.state;
        return (
            <Modal
                show={showModal}
                onHide={this.closeModal}
                className="detail-form show"
            >
                <Modal.Body>
                    <div className="modal-title">{data.moduleEN}</div>
                    <div className="duration">
                        <div className="value">{data.duration}</div>
                        <div className="duration-unit">Minutes</div>
                    </div>
                    {mode === 'detail' && <div className="detail">Details</div>}
                    {mode === 'detail' && <div className="detail-fields">
                        <div className="detail-field">
                            <div style={{ width: '50%', paddingRight: '3rem', paddingLeft: '0.5rem' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ minWidth: '70%', color: '#004b87', marginRight: '0.5rem', fontSize: '1.2rem', borderBottom: '1px solid #0000003f' }}>TRAINING TYPE</div><span>{data.trainingType}</span>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ minWidth: '70%', color: '#004b87', marginRight: '0.5rem', fontSize: '1.2rem', borderBottom: '1px solid #0000003f' }}>CATEGORY</div><span>{data.groupEN}</span>
                                </div>
                            </div>
                            <div style={{ width: '50%', paddingRight: '3rem' }}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ minWidth: '8.25rem', paddingRight: '10px', color: '#004b87', marginRight: '0.5rem', fontSize: '1.2rem', borderBottom: '1px solid #0000003f' }}>DESCRIPTION</div><span>{data.descriptionEN}</span>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ minWidth: '8.25rem', paddingRight: '10px', color: '#004b87', marginRight: '0.5rem', fontSize: '1.2rem', borderBottom: '1px solid #0000003f' }}>SIDE BY SIDE</div><span>{data.sideBySide === '1' ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="detail-array">
                            <div className="segments">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '0.25rem', height: '0.25rem', border: '1px solid', borderRadius: '50%' }} />
                                    <div style={{ height: '0.0625rem', width: '25%', background: 'black', marginRight: '1rem' }} />
                                    <div style={{}}>SEGMENTS</div>
                                </div>
                                <div className="block">
                                    {(data.departmentsList && data.departmentsList.length > 0) && data.departmentsList.map((item, index) => (<div key={index} style={{ fontSize: '14px' }}>{item}</div>))}
                                </div>
                            </div>
                            <div className="bp-flows">
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <div style={{ width: '0.25rem', height: '0.25rem', border: '1px solid', borderRadius: '50%' }} />
                                    <div style={{ height: '0.0625rem', width: '25%', background: 'black', marginRight: '1rem' }} />
                                    <div style={{}}>BP FLOWS</div>
                                </div>
                                <div className="block">
                                </div>
                            </div>
                            <div className="kpi">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '0.25rem', height: '0.25rem', border: '1px solid', borderRadius: '50%' }} />
                                    <div style={{ height: '0.0625rem', width: '25%', background: 'black', marginRight: '1rem' }} />
                                    <div style={{}}>KPI</div>
                                </div>
                                <div className="block">
                                    {(data.kpi && data.kpi.length > 0) && data.kpi.map((item, index) => (<div key={index} style={{ fontSize: '14px' }}>{item}</div>))}
                                </div>
                            </div>
                        </div>
                    </div>}
                    {mode === 'detail' && <div className="control">
                        <button className="btn close-btn" onClick={() => this.closeModal()}>Close <i className="fa fa-times-circle" style={{ color: 'black' }}></i></button>
                        <button className="btn close-btn" onClick={() => this.clickAssign()}>Assign to you & Launch <i className="fa fa-rocket" style={{ color: 'black' }}></i></button>
                    </div>}
                    {mode === 'assign' && <div className="assign-title">Are you sure you want to launch this document ?</div>}
                    {mode === 'assign' && <div className="assign-info">
                        By launching this document, you will be automatically assigned and redirected to it.
                    </div>}
                    {mode === 'assign' && <div className="assign-control">
                        <button className="btn cancel-btn" onClick={() => this.cancelModal()}>Cancel</button>
                        <button className="btn confirm-btn" onClick={() => this.clickConfirm()}>Confirm</button>
                    </div>}
                </Modal.Body>
            </Modal>
        );
    }
}

DetailForm.propTypes = {
    data: PropTypes.object.isRequired,
    showModal: PropTypes.bool,
    closeModal: PropTypes.func,
};

DetailForm.defaultProps = {
    showModal: false,
    closeModal: () => {},
};

export default DetailForm;
