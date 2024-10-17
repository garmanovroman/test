import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLoadScroll from "./hooks/useLoadScroll";
import useInput from "./hooks/useInput";
import defaultImg from "../images/def_chat.png";
import CreateProject from "./CreateProject";
import Network from "../Components/Requests";

export default function Projects(props) {
  const [projects, setProjects] = useState(props.projects);
  const refs = useRef();
  const params = useLoadScroll(refs, 15);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadElements = async () => {
      let guid = props.projects[params.indexload].forDisplayTape
        ? props.projects[params.indexload].guidDisplayTape
        : props.projects[params.indexload].projectGuid;

      const WorkplaceStructuresElements =
        await new Network().GetChildsWorkplaceStructuresForUserNew(
          6345,
          null,
          null,
          guid, //guid
          null,
          null,
          true,
          false,
          15
        );

      setProjects(WorkplaceStructuresElements);
      // refs.current.childNodes
      //   .item(params.indexload - 8)
      //   .scrollIntoView({ block: "center", inline: "center" });
      // refs.current.scrollTo(0, params.toScroll);
      refs.current.childNodes
        .item(params.indexload)
        .scrollIntoView({ block: "center", inline: "center" });
    };
    if (params.load) {
      loadElements();
    }
  }, [params.load]);

  useEffect(() => {
    setProjects(props.projects);
  }, [props.projects]);

  return (
    <>
      <div className="projects-container" ref={refs}>
        {projects.map((c, index) => {
          return (
            <div className="project-wth-dell" id={"refffs" + index}>
              <div
                id={c.projectGuid}
                className="flex pr-item"
                key={c.projectGuid}
                onClick={() => this.InteriorClicked(c)}
              >
                <div
                  style={{
                    backgroundColor:
                      c.currentCRMGroup != null
                        ? c.currentCRMGroup.color
                        : props?.groupColor,
                  }}
                  className="project-color"
                ></div>

                <div
                  className="pr-photo"
                  style={{
                    backgroundImage: `url("${
                      c.projectSmallPicturePath !== null
                        ? c.projectSmallPicturePath
                        : defaultImg
                    }`,
                  }}
                >
                  {c?.isAuthor && <div className="author">A</div>}
                </div>
                <div className="pr-info">
                  <div className="pr-title 1">
                    {c.name.length > 15 ? c.name.substr(0, 15) + "..." : c.name}
                  </div>
                  {c.forDisplayTape == false ? (
                    <div className="pr-container">
                      <div className="pr-counter">
                        <div className="pr-counter--item view">
                          {c.viewCount}
                        </div>
                        <div className="pr-counter--item share">
                          {c.shareCount}
                        </div>
                        <div className="pr-counter--item entry">
                          {c.entryCount}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pr-container">{c.displayTapeCreatedAt}</div>
                  )}

                  <div className="pr-descr">
                    {c.lastMessage?.content !== null &&
                    c.lastMessage?.content !== undefined
                      ? c.lastMessage?.content.substr(0, 10) + "..."
                      : ""}
                    <span>
                      {c.unreadMessagesCount > 0 && c.forDisplayTape == false
                        ? c.unreadMessagesCount
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
              {c.forDisplayTape == true && (
                <CreateProject guid={c?.guidDisplayTape} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
