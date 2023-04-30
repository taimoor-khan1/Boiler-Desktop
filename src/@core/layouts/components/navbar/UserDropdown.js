// ** React Imports
import { Link } from 'react-router-dom'
import { useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
// import { isUserLoggedIn } from '@utils'

// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

const UserDropdown = () => {
  // ** State
  const userDetails = JSON.parse(localStorage.getItem("userDetail"))
  const [userData] = useState(userDetails)


  //** ComponentDidMount
  // useEffect(() => {
  //   if (isUserLoggedIn() !== null) {
  //     setUserData(JSON.parse(localStorage.getItem('userData')))
  //   }
  // }, [])

  //** Vars
  // const userAvatar = (userData && userData.avatar) || defaultAvatar


  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{(userData && userData?.name) || 'John Doe'}</span>
          {/* <span className='user-status'>{(userData && userData?.role) || 'Admin'}</span> */}
        </div>
        <Avatar img={defaultAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to='/home'>
          <User size={14} className='me-75' />
          <span className='align-middle'>Home</span>
        </DropdownItem>


        <DropdownItem divider />

        <DropdownItem tag={Link} to='/ChangePassword'>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Change Password</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='/login'>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
