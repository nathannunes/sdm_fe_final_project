import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import CatalogItem from '../components/CatalogItem';
import Dashboard from '../components/Dashboard';

// TODO - add links to course content
// search query to modify:
// https://catalog.clemson.edu/search_advanced.php?cur_cat_oid=36&ecpage=1&cpage=1&ppage=1&pcpage=1&spage=1&tpage=1&search_database=Search&filter%5Bkeyword%5D=CPSC+6110&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1

const dummy_data = 
    { 
        level: "Graduate",
        courses: [ 
            { concentration: "Human Centered Computing (HCC)",
              subjectsList:  
                [ { code: "CPSC-6110",
                    name: "Virtual Reality Systems",
                    prerequisites: null
                  },
                  { code: "CPSC-6120",
                    name: "Eye Tracking Methodology and Applications",
                    prerequisites: null
                  }
                ]
            },
            { concentration: "Software Engineering",
              subjectsList: 
              [ { code: "CPSC-6160",
                  name: "2-D Game Engine Construction",
                  prerequisites: null
                },
                { code: "CPSC-6720",
                  name: "Software Development Methodology",
                  prerequisites: null
                }
              ]
            }
        ]
    };

// TODO: Add editing capability (new, modify, remove)

function Catalog() {
    return(
        <div align="center">
            <h1 align="center" style={{color: "#e27f0b"}}>Course Catalog: School of Computing ({dummy_data.level})</h1> 
            <Dashboard />
            <Accordion>
                {
                    dummy_data.courses.map( (item) => {
                        return <CatalogItem 
                            id={item.concentration}
                            concentration={item.concentration}
                            subjects={item.subjectsList}
                            key={item.concentration}
                        />
                    } )
                }
            </Accordion>
        </div>
    );
}

export default Catalog;