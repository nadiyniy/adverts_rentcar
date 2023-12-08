import styled from 'styled-components';

export const AdvertsCarsStyled = styled.div`
  .load-more-btn {
    background: none;
    border: none;
    display: block;
    margin: 0 auto;
    color: #3470ff;
    text-decoration: underline;
    margin-bottom: 150px;
    &:disabled {
      cursor: default;
      color: gray;
    }
    &:hover:not(&:disabled) {
      color: #0b44cd;
    }
  }
  .load-more-error {
    text-align: center;
  }
`;
