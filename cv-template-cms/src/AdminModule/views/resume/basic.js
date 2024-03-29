import './basic.css';
import {useDatabase} from "../../database/use-database";
import ResumeContainer from "../../components/resume-container";
import {suites} from "../../constants";
import {useAppState} from "../../state/app-state";
import {useEffect, useState} from "react";

function BasicResume() {
    const {setVisibleSection, activeSuite} = useAppState();
    const [lastVisibleSection, setLastVisibleSection] = useState('');
    const {personalInformation,
            workHistory,
            skills,
            languages,
            projects,
            references,
            education,
            awards,
    } = useDatabase();

    function getLastVisibleSection(quarterFromTop) {
        const sections = document.querySelectorAll('.animated');
        const sectionsArray = Array.from(sections);
        const bottom = window.innerHeight / 4 * quarterFromTop;
        return sectionsArray.filter((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top < bottom && rect.bottom > bottom;
        });
    }

    useEffect(() => {
        function handleScroll() {

            if (window.scrollY <= 100 ) {
                // set the first section to be visible
                setVisibleSection(suites.PERSONAL_INFORMATION);
                return;
            }

            const bottom = getLastVisibleSection(4);

            if (bottom.length > 0) {
                setLastVisibleSection(bottom[0].id.split('-').splice(1, bottom[0].id.split('-').length).join('-'))
            }

            // if we are at the bottom of the page, set the last section to be visible
            if (window.scrollY >= document.body.clientHeight - window.innerHeight - 100) {
                if (bottom.length > 0 || lastVisibleSection) {
                    if (bottom.length === 0) {
                        setVisibleSection(lastVisibleSection)
                    }else{
                        const sectionIdSplit = bottom[0].id.split('-');
                        setVisibleSection(sectionIdSplit.splice(1, sectionIdSplit.length).join('-'));
                    }
                    return;
                }
            }

            const quarter = getLastVisibleSection(2);

            // if we are in the middle of the page, set the middle section to be visible
            if (quarter.length > 0) {
                const sectionIdSplit = quarter[0].id.split('-');
                setVisibleSection(sectionIdSplit.splice(1, sectionIdSplit.length).join('-'));
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [setVisibleSection, lastVisibleSection]);

    useEffect(() => {
        function scrollToSection(section) {
            const element = document.getElementById(`section-${section}`);
            if (element) {
                element.scrollIntoView({behavior: 'smooth'});
            }
        }
        if (activeSuite) {
            scrollToSection(activeSuite);
        }
    }, [activeSuite]);

    return (
        <ResumeContainer>
            <div className={'basic-resume'} id={'resume'}>
                <div id={`section-${suites.PERSONAL_INFORMATION}`} className={`animated ${personalInformation.getValue('hide') ?
                 `swipe-collapse-out` : ``}`}>
                    <section className="header">
                        <div className={'personal-information'}>
                            <h1>{personalInformation.getValue('fullName')}</h1>
                            <div>{personalInformation.getValue('address')}</div>
                            <div><a href={`mailto:${personalInformation.getValue('emailAddress')}`}>{personalInformation.getValue('emailAddress')}</a></div>
                            <div> <a href={'tel:' + personalInformation.getValue('contactNumber')}>{personalInformation.getValue('contactNumber')}</a></div>
                            <div className={'social-media'}>
                                {(personalInformation.getValue('socials') || []).map((socialMedia, index) => {
                                    return <div key={index}><a href={socialMedia.url}><i className={socialMedia.icon}/></a></div>
                                })}
                            </div>
                            <div>{personalInformation.getValue('bio')}</div>
                        </div>
                        <div className={'profile-image'}>
                            <img src={personalInformation.getValue('profileImage')} alt="profile picture"/>
                        </div>
                    </section>
                </div>

                <div id={`section-${suites.WORK_HISTORY}`} className={`animated ${workHistory.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="experience">
                        <h2>Work Experience</h2>
                        {(workHistory.getValue('items') || []).map((work, index) => {
                            return <div key={index}>
                                <h3>{work.jobTitle}</h3>
                                <div className={'company'}>{work.website ? <a rel="noreferrer" target={'_blank'} href={work.website}>{work.company}
                                    <i className="fa fa-external-link link-icon"></i></a> : work.company} {work.location && work.company && '-'} {work.location}</div>
                                <div className={'dates'}>{work.startDate} {work.startDate && work.endDate && '~'} {work.endDate}</div>

                                <div className={'description'}>{work.description}</div>

                                <ul><div className={'bullet-grid'}>{(work.items || []).map(subItem => {
                                    return <li key={subItem.id}>{subItem.value}</li>
                                })}</div></ul>
                            </div>
                        })}
                    </section>
                </div>

                <div id={`section-${suites.EDUCATION}`} className={`animated ${education.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="education">
                        <h2>Education</h2>
                        {(education.getValue('items') || []).map((education, index) => {
                            return <div key={index}>
                                <h3>{education.qualification}</h3>
                                {education.fileUrl && <div className={'download'}><a rel={'noreferrer'} target={'_blank'} download href={education.fileUrl}>Download Qualification</a></div>}
                                <div className={'company'}>{education.institute} {education.location && education.institute && '-'} {education.location}</div>
                                <div className={'dates'}>{education.startDate} {education.startDate && education.endDate && '~'} {education.endDate}</div>
                                <div className={'description'}>{education.description}</div>
                                <ul><div className={'bullet-grid'}>{(education.items || []).map(subItem => {
                                    return <li key={subItem.id}>{subItem.value}</li>
                                })}</div></ul>
                            </div>
                        })}
                    </section>
                </div>

                <div id={`section-${suites.SKILLS}`} className={`animated ${skills.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="skills">
                        <h2>Skills</h2>
                        <div className={'tag-cloud'}>
                            {(skills.getValue('items') || []).map((skill, index) => {
                                return <div key={index} className={'tag'}><strong>{skill.name}</strong> <br/> {skill.level}</div>
                            })}
                        </div>
                    </section>
                </div>

                <div id={`section-${suites.LANGUAGES}`} className={`animated ${languages.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="languages">
                        <h2>Languages</h2>
                        <div className={'tag-cloud'}>
                            {(languages.getValue('items') || []).map((skill, index) => {
                                return <div key={index} className={'tag'}><strong>{skill.name}</strong> <br/> {skill.level}</div>
                            })}
                        </div>
                    </section>
                </div>

                <div id={`section-${suites.PROJECTS}`} className={`animated ${projects.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="projects">
                        <h2>Projects</h2>
                        {(projects.getValue('items') || []).map((project, index) => {
                            return <div key={index}>
                                <h3>{project.name}</h3>
                                {project.fileUrl && <div className={'download'}><a rel={'noreferrer'} target={'_blank'} download href={project.fileUrl}>Download File</a></div>}

                                <div className={'company'}>{project.institution} {project.location && project.institution && '-'} {project.location}</div>
                                <div className={'dates'}>{project.startDate} {project.startDate && project.endDate && '~'} {project.endDate}</div>

                                <div className={'description'}>{project.description}</div>

                                <ul><div className={'bullet-grid'}>{(project.items || []).map(subItem => {
                                    return <li key={subItem.id}>{subItem.value}</li>
                                })}</div></ul>
                            </div>
                        })}
                    </section>
                </div>

                <div id={`section-${suites.AWARDS}`} className={`animated ${awards.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="awards">
                        <h2>Awards</h2>
                        {(awards.getValue('items') || []).map((award, index) => {
                            return <div key={index}>
                                <h3>{award.name}</h3>
                                {award.fileUrl && <div className={'download'}><a rel={'noreferrer'} target={'_blank'} download href={award.fileUrl}>Download File</a></div>}

                                <div className={'company'}>{award.institution} {award.location && award.institution && '-'} {award.location}</div>
                                <div className={'dates'}>{award.startDate} {award.startDate && award.endDate && '~'} {award.endDate}</div>

                                <div className={'description'}>{award.description}</div>

                                <ul><div className={'bullet-grid'}>{(award.items || []).map(subItem => {
                                    return <li key={subItem.id}>{subItem.value}</li>
                                })}</div></ul>
                            </div>
                        })}
                    </section>
                </div>

                <div id={`section-${suites.REFERENCES}`} className={`animated ${references.getValue('hide') ? `swipe-collapse-out` : ``}`}>
                    <section className="references">
                        <h2>References</h2>
                        <div className={'tag-cloud'}>
                            {(references.getValue('items') || []).map((reference, index) => {
                                return <div key={index} className={'tag'}>
                                    <h3>{reference.name}</h3>
                                    <div className={'company'}>{reference.position} {reference.position && reference.company && '-'} {reference.company}</div>
                                    <ul>
                                        <li> <a href={'tel:' + reference.phone}> {reference.phone} </a></li>
                                        <li> <a href={`mailto:${reference.email}?subject=Reference for ${personalInformation.getValue('fullName')}&body=${encodeURIComponent(`Dear ${reference.name},
                                    
I am writing to you from [company name] regarding ${personalInformation.getValue('fullName')}. ${personalInformation.getValue('fullName')} has applied for the [job title] position at our company.

We were very impressed with ${personalInformation.getValue('fullName')}'s CV and were hoping that you could provide us with some additional information about their work ethic, skills, and personality.

Specifically, we would be interested in hearing about your experience working with ${personalInformation.getValue('fullName')} on [specific projects or tasks]. We would also like to know your thoughts on their strengths and weaknesses, as well as their potential fit for our company culture.

Thank you for your time and consideration. We look forward to hearing from you soon.

Sincerely,
[Your name]`)}`}>{reference.email}</a>
                                        </li>
                                    </ul>
                                </div>
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </ResumeContainer>
  );
}

export default BasicResume;
