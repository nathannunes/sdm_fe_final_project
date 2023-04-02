import React from 'react';

const StudentNAdvisees = (props, index) => {
    return(
                <tr key={index}>
                    <td align={"center"}><strong>{props.name}</strong></td>
                    <td align={"center"}>{props.advisor.advisorName}</td>
                </tr>
    );

};
export default StudentNAdvisees;
