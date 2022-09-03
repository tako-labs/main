export default function ANIM_Ellipsis() {
  return (
    <>
      <style jsx>
        {`
          .ellipsis-anim span {
            opacity: 0;
            -webkit-animation: ellipsis-dot 1s infinite;
            animation: ellipsis-dot 1s infinite;
          }

          .ellipsis-anim span:nth-child(1) {
            -webkit-animation-delay: 0s;
            animation-delay: 0s;
          }
          .ellipsis-anim span:nth-child(2) {
            -webkit-animation-delay: 0.1s;
            animation-delay: 0.1s;
          }
          .ellipsis-anim span:nth-child(3) {
            -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s;
          }

          @-webkit-keyframes ellipsis-dot {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes ellipsis-dot {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
      <span className='ellipsis-anim'>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </>
  );
}