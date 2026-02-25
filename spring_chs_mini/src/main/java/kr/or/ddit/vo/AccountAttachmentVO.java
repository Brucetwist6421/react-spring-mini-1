package kr.or.ddit.vo;

import lombok.Data;

@Data
public class AccountAttachmentVO {
    private Long seq;
    private Long accountSeq;
    private String fileName;
}
