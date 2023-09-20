import React, { useContext } from 'react'
import { UserContext } from '@renderer/context/user'
import { Link } from 'react-router-dom'
import { SpeakerModerateIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { Button } from '../form'

export interface PackageAlertProps {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export const PackageAlert: React.FC<PackageAlertProps> = ({  }) => {
  const { loadProfile, user, shouldCharge } = useContext(UserContext)
  const { t } = useTranslation()
  const { RENDERER_VITE_PRICING_URL } = import.meta.env;

  const openStripe = () => {
    window.open(RENDERER_VITE_PRICING_URL + `?prefilled_email=${user?.email}&client_reference_id=${user?.id}`, "_blank");
  }

  return shouldCharge() ? (
    <div className="absolute bottom-0 right-0 h-10 w-full">
      <div className="flex items-center justify-center h-full px-4 color-white gap-2" style={{backgroundColor: 'rgba(239,68,68,.9)'}}>
        <span><SpeakerModerateIcon/> {t('packageExpired.error')}</span>
        <Link to={'#'} onClick={openStripe} className='underline' style={{color: 'var(--amber5)'}}>{t('topUp.label')}</Link>
        <Button className='cursor' style={{
          height: '1.5rem',
        }} onClick={loadProfile}>{t("topUpFinished.label")}</Button>
      </div>
    </div>
  ) : null
}
