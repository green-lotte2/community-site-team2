import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../config/url";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "./Modal"; // 모달 컴포넌트 추가
import moment from "moment";
import { Target } from "react-feather";


// noticeBoard 정의


const NoticeBoard = ({ backendUrl }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/board/notice`, {
          params: { cate: "notice" },
        });
        console.log("response : ", response.data);
        setNotices(response.data);
      } catch (error) {
        console.error("Error :", error);
      }
    };

    fetchNotices();

  }, [backendUrl]);

  // 마지막의 마침표를 제거하는 함수
  const removeLastDot = (str) => {
    if (str.endsWith(".")) {
      return str.slice(0, -1); // 마지막 한 글자 제거
    }
    return str;
  };

  return (
    <div className="noticeBoard">
      <h4>Notice</h4>
      <table>
        <tbody>
          {notices.map((notice, index) => (
            <tr key={index}>
              <td className="rdate">
                {removeLastDot(new Date(notice.rdate).toLocaleDateString())}
              </td>
              <td>
                <Link to={`/board/view/notice/${notice.no}`} className="title">
                  {notice.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="viewText">
        <Link to={`/board/list?cate=notice`}>View all &nbsp;&nbsp; {">"}</Link>
      </p>
    </div>
  );
};

// Dashboard 컴포넌트 정의
const Dashboard = () => {
  const location = useLocation();
  const authSlice = useSelector((state) => state.authSlice) || {};
  const navigate = useNavigate();
  const [todayTask, setTodayTask] = useState([]);

  useEffect(() => {
    axios.get(url.backendUrl + '/calendar/dash?uid='+authSlice.username)
      .then((res) => {
        console.log(res)
        setTodayTask(res.data);
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const deleteTaskHandler = (e) => {
    console.log(e.target.value)
    if(window.confirm("삭제하시겠습니까?")){
      axios.delete(url.backendUrl + '/calendar/delete?uid='+e.target.value)
      .catch((e)=>{
        console.log(e)
      })
    }else{
      e.target.checked = false
    }
  }

  const [user, setUser] = useState(
    location.state
      ? location.state.user
      : {
        uid: "",
        nick: "",
        image: "",
        email: "",
        hp: "",
      }
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!authSlice.username) {
      alert("로그인 해주세요.");
      navigate("/user/login");
    } else {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(
            url.backendUrl + "/main/" + authSlice.username
          );
          console.log(res.data);
          setUser(res.data);
        } catch (e) {
          console.log(e);
        }
      };

      fetchUserData();
    }
  }, [authSlice.username, navigate]);

  console.log("이거 띄워라" + JSON.stringify(user));

  return (
    <>
      {authSlice.username ? (
        <>
          <div className="Dashboard">
            <div className="top">
              <div className="profileBox">
                <p className="loginUser">Welcome, {user.uid}</p>
                <div className="profile">
                  <div className="profile_img">
                    <img
                      src={`${url.backendUrl}/images/${authSlice.userImg}`}
                      alt="profile"
                    />
                  </div>
                  <div className="info">
                    <ul className="userInfo">
                      <li>
                        <span className="label">이름 :</span>
                        <span className="value">{user.uid}</span>
                      </li>
                      <li>
                        <span className="label">닉네임 :</span>
                        <span className="value">{user.nick}</span>
                      </li>
                      <li>
                        <span className="label">이메일 :</span>
                        <span className="value">{user.email}</span>
                      </li>
                      <li>
                        <span className="label">전화번호 :</span>
                        <span className="value">{user.hp}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/*profile end*/}
                <p className="viewText">
                  <Link to={`/user/mypage`}>My profile &nbsp;&nbsp; {">"}</Link>
                </p>
              </div>
              {/*profileBox end */}
              <NoticeBoard backendUrl={url.backendUrl} />
            </div>
            {/*top end*/}
            <div className="bottom">
              <div className="toDoList">
                <div className="taskTitle">
                  <p>Today Task</p>
                  <button onClick={openModal}>
                    <img src="../../images/plus_50.png" alt="addBtn" />
                  </button>
                </div>
                <div className="taskList">
                  <table>
                    <tbody>
                      {todayTask.map((task, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <input type="checkbox" value={task.id} onClick={deleteTaskHandler} />
                            </td>
                            <td>{task.title}</td>
                            <td>{moment(task.start).format("yyyy-MM-DD")}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="projectBox">
                <div>프로젝트</div>
              </div>
            </div>
          </div>
          {/*Dashboard end */}
          <Modal isOpen={isModalOpen} onClose={closeModal} />{" "}
          {/* 모달 컴포넌트 추가 */}
        </>
      ) : (
        <h2>로그인 해주세요.</h2>
      )}
    </>
  );
};

export default Dashboard;
