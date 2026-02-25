package kr.or.ddit.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountVO {

    // 1. tb_account (계정 기본 정보)
    private Integer accountSeq;         // 계정 일련번호 (serial)
    private Integer curSeq;         // 교육과정 일련번호 (fk)
    private String accountId;       // 아이디 (unique)
    private String accountName;     // 이름
    private String accountEmail;  // 이메일 (unique)
    private String accountPasswd; // 비밀번호
    private LocalDate birth;        // 생년월일
    private String gender;          // 성별 (M/F)
    private String tel;             // 전화번호
    private String emergencyTel;    // 비상 전화번호 (추가)
    private String identNumber;     // 주민등록번호 (추가)
    private String email;           // 이메일 (DB: account_email)
    private String dropout_info;  // 중도탈락 정보 (text)
    private String address;         // 주소
    private String maritalStatus;   // 혼인여부 (추가)
    
    // 2. 학력 및 경력 정보
    private String edu;             // 최종학력
    private String major;           // 전공
    private String gradType;        // 졸업구분
    private String career;          // 경력사항 (text)
    private String licenses;        // 자격증 (추가)
    private String prevCompany;     // 전 직장명 (추가)
    private LocalDate quitDate;     // 퇴사일자 (추가)
    private String militaryStatus;  // 군복무 구분
    
    // 3. 상태 및 관리 정보
    private String status;          // 상태 (ENROLLED 등)
    private String dropoutInfo;     // 중도탈락 정보 (변수명 교정)
    private String accountType;     // 계정타입 (STU 등)
    private LocalDateTime regDate;  // 등록일시
    private String updateId;        // 수정자ID
    private LocalDateTime updateDate; // 수정일시

    // 4. tb_curriculum (조인 정보)
    private String curName;         // 과정명
    private String businessName;    // 사업명
    private LocalDate startDate;    // 과정 시작일
    private LocalDate endDate;      // 과정 종료일
    private String room;            // 교육실 (추가)
    private String term;            // 기수 (추가)
    private String teacherSeq;      // 담당자 일련번호 (account_seq)
    private String teacherName;     // 담임 이름 

    private List<AccountAttachmentVO> attachments; // 첨부파일 리스트

}