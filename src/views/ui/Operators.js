import React, { useEffect, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import './operators.scss'
import { Container, Col, Row, Input, CardBody, CardTitle, InputGroupText, InputGroup, Accordion, AccordionItem, AccordionHeader, AccordionBody, FormGroup, Label, Table } from "reactstrap";
// import Nodata from '../../assets/images/nodata.jpg'



function Operators(props) {
  const [page, setPage] = useState(1)
  //const [rowPerPage, setRowPerPage] = useState(50)
  const [users, setUsers] = useState([])
  const [filterStates, setFilterStates] = useState([])
  const [requestFilter, setRequestFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('Marijuana');
  const [visibleStatesRows, setVisibleStatesRows] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    console.log(event.target.value)
    setSearchQuery(event.target.value);
    setLoading(true)
    setPageNumber(1)
    setUsers([])
  };

  const [getTotalRecords, setTotalRecords] = useState(0)
  let rowPerPage = 50

  //   const { innerWidth: width, innerHeight: height } = window

  const loadMore = async () => {

    try {
      // let url = `http://3.228.211.76:5000/api/v1/operators?limit=10&page=1&state=MN,AK&sort_by=address&country=US&category=Marijuana`
      let url = `http://localhost:5000/api/v1/operators?limit=${rowPerPage}&page=${pageNumber}`
      if (requestFilter || selectedCountry || selectedCategory) {
        console.log('requestFilter', requestFilter.length)
        url += `&${requestFilter.length >= 1 ? `state=${requestFilter}` : ''}${selectedCountry ? `&country=${selectedCountry}` : 'US'}${selectedCategory ? `&category=${selectedCategory}` : 'Marijuana'}`;
      }
      if (searchQuery) {
        console.log(searchQuery)
        url += `${searchQuery ? `&search=${searchQuery}` : ''}`
      }
      const response = await fetch(url);
      const json = await response.json();
      const totalDataRecords = json?.pagination?.[0]?.total
      console.log(json?.data)
      setUsers([...users, ...json.data])
      setTotalRecords(totalDataRecords)
      setLoading(false)
      setPageNumber(1 + pageNumber)
    } catch (e) {
      setUsers([])
      setLoading(false)
      setTotalRecords(0)
      console.log(e);
    }
  }

  const loadInitialFilters = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/operators?limit=50&page=1`);
      const json = await response.json();
      setFilterStates(json?.filters?.states)

      setLoading(false)
    } catch (e) {
      console.log(e);
    }
  }

  const onChange = (e) => {
    setLoading(true)
    if (requestFilter.includes(e.target.value)) {
      setRequestFilter(requestFilter.filter(item => item !== e.target.value));
      setUsers([])
    } else {
      setRequestFilter([...requestFilter, e.target.value]);
      setUsers([])
    }
    setPageNumber(1)
  }

  useEffect(() => {
    loadMore()
  }, [requestFilter, selectedCategory, selectedCountry, searchQuery]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setPageNumber(1)
    setLoading(true)
    setUsers([])
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPageNumber(1)
    setLoading(true)
    setUsers([])
  };

  useEffect(() => {
    loadInitialFilters();
  }, []);

  const Footer = () => {
    return (
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    )
  }

  const filterReset = () => {
    setPageNumber(1)
    setUsers([])
    setRequestFilter([])
    loadMore()
    setSelectedCountry('US')
    setSelectedCategory('Marijuana')
  }


  // Accordian
  const [open, setOpen] = useState('');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  return (

    <div className='operators-main row'>
      <h1>Operators</h1>
      <div className='hd-man'>
        <Row>
          <Col md={{ offset: 8, order: 2, size: 4 }} xs="12">
            <div className='gblsrch pb-3'>
              <InputGroup>
                <InputGroupText>
                  @
                </InputGroupText>
                <Input
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Global Search"
                  type="text"
                />
              </InputGroup>
            </div>
          </Col>
        </Row>
      </div>
      <div className='rowmn'>
        <div className='row'>
          <div className='col-12 col-lg-4  col-xxl-3'>
            <div className='side-bar filter-wrp'>
              <div className='filter-in'>
                <h4>Filters</h4>
                <div>
                  <button className='btn btn-link' onClick={() => filterReset()}>Reset</button>
                </div>
              </div>
              <Accordion flush open={open} toggle={toggle}>
                <AccordionItem>
                  <AccordionHeader targetId="1">Category</AccordionHeader>
                  <AccordionBody accordionId="1">
                    <FormGroup className='pb-2' check>
                      <Input type='radio' id='category'
                        checked={selectedCategory === 'Hemp'}
                        value={'Hemp'}
                        onChange={handleCategoryChange} />
                      <Label htmlFor='category' check>
                        Hemp
                      </Label>
                    </FormGroup>
                    <FormGroup className='pb-2' check>
                      <Input type='radio' id='category_1'
                        checked={selectedCategory === 'Marijuana'}
                        value={'Marijuana'}
                        onChange={handleCategoryChange} />
                      <Label htmlFor='category_1' check>
                        Marijuana
                      </Label>
                    </FormGroup>
                  </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                  <AccordionHeader targetId="2">Country</AccordionHeader>
                  <AccordionBody accordionId="2">
                    <FormGroup className='pb-2' check>
                      <Input type='radio' id='country'
                        checked={selectedCountry === 'CA'}
                        value={'CA'}
                        onChange={handleCountryChange} />
                      <Label htmlFor='country' check>CA</Label>
                    </FormGroup>
                    <FormGroup className='pb-2' check>
                      <Input type='radio' id='country_1'
                        checked={selectedCountry === 'US'}
                        value={'US'}
                        onChange={handleCountryChange} />
                      <Label htmlFor='country_1' check>US</Label>
                    </FormGroup>
                  </AccordionBody>
                </AccordionItem>
                
              </Accordion>
            </div>

            
          </div>
          <div className='col-lg-8 col-xxl-9 col-12'>
            {!loading && getTotalRecords >= 1 ?
              <div className='op-main'>
                <TableVirtuoso
                  className='side-bar table'
                  style={{ height: 600 }}
                  data={users}
                  endReached={() => {
                    if (users.length < getTotalRecords) {
                      loadMore();
                    }
                  }}
                  increaseViewportBy={600}
                  fixedHeaderContent={() => (
                    <tr >
                      <th className='tbl-hd address'>Address</th>
                      <th className='tbl-hd addressstate'>Address State</th>
                      {/* <th className='tbl-hd apn'>APN</th> */}
                      <th className='tbl-hd appLicenseTypeCode'>APP License Type Code</th>
                      <th className='tbl-hd bnddexpirydate'>Bndd Expiry Date</th>
                      <th className='tbl-hd businessName'>Business Name</th>
                      <th className='tbl-hd category'>Category</th>
                      <th className='tbl-hd cityName'>City Name</th>
                      <th className='tbl-hd commontradename'>Common Trade Name</th>
                      <th className='tbl-hd contactaddress'>Contact Address</th>
                      <th className='tbl-hd contactemail'>Contact Email</th>
                      <th className='tbl-hd contactfirstname'>Contact First Name</th>
                      <th className='tbl-hd contactlastname'>Contact Last Name</th>
                      <th className='tbl-hd contactname'>Contact Name</th>
                      <th className='tbl-hd contactphone'>Contact Phone</th>
                      <th className='tbl-hd contacttype'>Contact Type</th>
                      <th className='tbl-hd countrycode'>Country Code</th>
                      <th className='tbl-hd countyName'>County Name</th>
                      <th className='tbl-hd electricityprovider'>Electricity Provider</th>
                      <th className='tbl-hd email'>Email</th>
                      <th className='tbl-hd expirydate'>Expiry Date</th>
                      <th className='tbl-hd facebook'>Facebook</th>
                      <th className='tbl-hd formationdate'>Formation Date</th>
                      <th className='tbl-hd hasContact'>Has Contact</th>
                      <th className='tbl-hd instagram'>Instagram</th>
                      <th className='tbl-hd isapproxLocation'>Is Approx Location</th>
                      <th className='tbl-hd issuedate'>Issue Date</th>
                      <th className='tbl-hd lat'>LAT</th>
                      <th className='tbl-hd licenseNo'>License No</th>
                      <th className='tbl-hd licensestatus'>License Status</th>
                      <th className='tbl-hd licensestatusdetail'>License Status Detail</th>
                      <th className='tbl-hd licensetype'>License Type</th>
                      <th className='tbl-hd linkedin'>Linkedin</th>
                      <th className='tbl-hd linkedoperatorname'>Linked Operator Name</th>
                      <th className='tbl-hd lon'>Lon</th>
                      <th className='tbl-hd mostcommonaddress'>Most Common Address</th>
                      <th className='tbl-hd mostcommoncity'>Most Common City</th>
                      <th className='tbl-hd mostcommonstate'>Most Common State</th>
                      <th className='tbl-hd mostcommonzip'>Most Common Zip</th>
                      <th className='tbl-hd phone'>Phone</th>
                      <th className='tbl-hd remarks'>Remarks</th>
                      <th className='tbl-hd socialequity'>Social Equity</th>
                      <th className='tbl-hd sosregnumber'>SOS Reg Number</th>
                      <th className='tbl-hd stateCode'>State Code</th>
                      <th className='tbl-hd storefrontname'>Store Front Name</th>
                      <th className='tbl-hd tradeName'>Trade Name</th>
                      <th className='tbl-hd twitter'>Twitter</th>
                      <th className='tbl-hd usage'>Usage</th>
                      <th className='tbl-hd website'>Website</th>
                      <th className='tbl-hd zip'>Zip</th>
                    </tr>
                  )}
                  itemContent={(index, item) => (
                    <>
                      <td className='tbl-cell address'><span>{item.address}</span></td>
                      <td className='tbl-cell addressstate'><span>{item.addressstate}</span></td>
                      {/* <td className='tbl-cell apn'><span>{item.apn}</span></td> */}
                      <td className='tbl-cell appLicenseTypeCode'><span>{item.appLicenseTypeCode}</span></td>
                      <td className='tbl-cell bnddexpirydate'><span>{item.bnddexpirydate}</span></td>
                      <td className='tbl-cell businessName'><span>{item.businessName}</span></td>
                      <td className='tbl-cell category'><span>{item.category}</span></td>
                      <td className='tbl-cell cityName'><span>{item.cityName}</span></td>
                      <td className='tbl-cell commontradename'><span>{item.commontradename}</span></td>
                      <td className='tbl-cell contactaddress'><span>{item.contactaddress}</span></td>
                      <td className='tbl-cell contactemail'><span>{item.contactemail}</span></td>
                      <td className='tbl-cell contactfirstname'><span>{item.contactfirstname}</span></td>
                      <td className='tbl-cell contactlastname'><span>{item.contactlastname}</span></td>
                      <td className='tbl-cell contactname'><span>{item.contactname}</span></td>
                      <td className='tbl-cell contactphone'><span>{item.contactphone}</span></td>
                      <td className='tbl-cell contacttype'><span>{item.contacttype}</span></td>
                      <td className='tbl-cell countrycode'><span>{item.countrycode}</span></td>
                      <td className='tbl-cell countyName'><span>{item.countyName}</span></td>
                      <td className='tbl-cell electricityprovider'><span>{item.electricityprovider}</span></td>
                      <td className='tbl-cell email'><span>{item.email}</span></td>
                      <td className='tbl-cell expirydate'><span>{item.expirydate}</span></td>
                      <td className='tbl-cell facebook'><span>{item.facebook}</span></td>
                      <td className='tbl-cell formationdate'><span>{item.formationdate}</span></td>
                      <td className='tbl-cell hasContact'><span>{item.hasContact}</span></td>
                      <td className='tbl-cell instagram'><span>{item.instagram}</span></td>
                      <td className='tbl-cell isapproxLocation'><span>{item.isapproxLocation}</span></td>
                      <td className='tbl-cell issuedate'><span>{item.issuedate}</span></td>
                      <td className='tbl-cell lat'><span>{item.lat}</span></td>
                      <td className='tbl-cell licenseNo'><span>{item.licenseNo}</span></td>
                      <td className='tbl-cell licensestatus'><span>{item.licensestatus}</span></td>
                      <td className='tbl-cell licensestatusdetail'><span>{item.licensestatusdetail}</span></td>
                      <td className='tbl-cell licensetype'><span>{item.licensetype}</span></td>
                      <td className='tbl-cell linkedin'><span>{item.linkedin}</span></td>
                      <td className='tbl-cell linkedoperatorname'><span>{item.linkedoperatorname}</span></td>
                      <td className='tbl-cell lon'><span>{item.lon}</span></td>
                      <td className='tbl-cell mostcommonaddress'><span>{item.mostcommonaddress}</span></td>
                      <td className='tbl-cell mostcommoncity'><span>{item.mostcommoncity}</span></td>
                      <td className='tbl-cell mostcommonstate'><span>{item.mostcommonstate}</span></td>
                      <td className='tbl-cell mostcommonzip'><span>{item.mostcommonzip}</span></td>
                      <td className='tbl-cell phone'><span>{item.phone}</span></td>
                      <td className='tbl-cell remarks'><span>{item.remarks}</span></td>
                      <td className='tbl-cell socialequity'><span>{item.socialequity}</span></td>
                      <td className='tbl-cell sosregnumber'><span>{item.sosregnumber}</span></td>
                      <td className='tbl-cell stateCode'><span>{item.stateCode}</span></td>
                      <td className='tbl-cell storefrontname'><span>{item.storefrontname}</span></td>
                      <td className='tbl-cell tradeName'><span>{item.tradeName}</span></td>
                      <td className='tbl-cell twitter'><span>{item.twitter}</span></td>
                      <td className='tbl-cell usage'><span>{item.usage}</span></td>
                      <td className='tbl-cell website'><span>{item.website}</span></td>
                      <td className='tbl-cell zip'><span>{item.zip}</span></td>
                    </>
                  )}
                  components={{ Footer }}
                />
                <div className='ttl-rcd'>
                  <p>Total Records : <strong>{getTotalRecords}</strong></p>
                </div>
              </div>
              :
              <div className='nodata'>
                {loading ?
                  <div className='pt-5'>
                    <div className="loadingio-spinner-spin-nq4q5u6dq7r"><div className="ldio-x2uulkbinbj">
                      <div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
                    </div></div>
                    <p>Loading...</p>

                  </div> :
                  <>
                    {/* <img src={Nodata} alt="No Data Available" /> */}
                    <p>No Data Available</p>
                  </>
                }
              </div>
            }
          </div>
        </div>
      </div>


      {/* <!-- Modal --> */}
      <div className='modal modal-lg fade' id='filterStatesModal' tabIndex='-1' aria-labelledby='filterStatesModalLbl' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='filterStatesModalLbl'>States</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <div className='row'>

                {filterStates?.length > 0 &&
                  filterStates
                    .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
                    .map((val, i) => (
                      <div className='col-3' key={i}>
                        <label className="op-check">
                          <input
                            type="checkbox"
                            checked={requestFilter.includes(val)}
                            value={val}
                            onChange={onChange}
                          />
                          <span>{val}</span>
                        </label>
                      </div>
                    ))}

              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Operators;
